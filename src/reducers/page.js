import * as types from '../constants/ActionTypes';
import { fromJS, OrderedSet, Map, Set } from 'immutable';

const mergeDeep = (state = Map(), data) => {
  return state.mergeDeep(data)
}

const updateCollection = (state = Map(), data) => {
  const oldKeys = Set(state.keys())
  const newKeys = Set(data.keys())
  const toRemove = oldKeys.subtract(newKeys)
  toRemove.forEach(key => state = state.remove(key))
  newKeys.forEach(key => state = state.set(key, mergeDeep(state.get(key), data.get(key))))
  return state
}

const findLastKey = (state, subPath) => {
  for (let key of state.get('historyOrder').reverse().toList()) {
    let lastVal = state.getIn(['modelHistory', key].concat(subPath))
    if (lastVal !== undefined) {
      return key
    }
  }
}

const updateSingle = (state, subPath, data) => {
  // Merge data -> history -> current
  const key = findLastKey(state, subPath)
  let lastVal = Map()
  if (key !== undefined) {
    lastVal = state.getIn(['modelHistory', key].concat(subPath))
  }
  return state.setIn(
    ['modelHistory', state.get('currentKey')].concat(subPath),
    mergeDeep(lastVal, data)
  )
}

const updateMulti = (state, subPath, data) => {
  // Merge data -> history -> current
  const key = findLastKey(state, subPath)
  let newCollection = Map()
  data.forEach(o => newCollection = newCollection.set(o.key, fromJS(o)))
  let lastCollection = Map()
  if (key !== undefined) {
    lastCollection = state.getIn(['modelHistory', key].concat(subPath))
  }
  const prePath = ['modelHistory', state.get('currentKey')]
  const byKeySubpath = prePath.concat([subPath[0]]).concat(['byKey'])
  return state.setIn(
    prePath.concat(subPath),
    updateCollection(lastCollection, newCollection)
  ).setIn(
    byKeySubpath,
    mergeDeep(state.getIn(byKeySubpath), newCollection)
  )
}

const page = (state = Map({
  currentKey: undefined,
  historyOrder: OrderedSet(),  // Reverse ordered LRU keys
  stateHistory: Map(),
  modelHistory: Map(),
}), action) => {
  let currentPageState = state.getIn(['stateHistory', action.pageKey])
  if (currentPageState === undefined) {
    currentPageState = Map()
  }
  const currentKey = state.get('currentKey')
  let currentPageModels = state.getIn(['modelHistory', currentKey])
  if (currentPageModels === undefined) {
    currentPageModels = Map()
  }

  let subPath
  switch (action.type) {
    case types.RESET_PAGE:
      state = state.set('currentKey', action.pageKey)
      if (action.defaultState && state.getIn(['stateHistory', action.pageKey]) === undefined) {
        state = state.setIn(['stateHistory', action.pageKey], fromJS(action.defaultState))
      }
      state = state.set('historyOrder', state.get('historyOrder').delete(action.pageKey).add(action.pageKey))
      return state
    case types.SET_PAGE_STATE:
      return state.setIn(['stateHistory', action.pageKey],
        currentPageState.merge(action.pageState))
    case types.RECEIVE_TEAM_INFO:
      return updateSingle(
        state,
        ['teams', 'byKey', action.teamKey],
        action.data)
    case types.RECEIVE_TEAM_YEAR_EVENTS:
      return updateMulti(
        state,
        ['events', 'collections', 'byTeamYear', action.teamKey, action.year],
        action.data)
    case types.RECEIVE_EVENT_INFO:
      return updateSingle(
        state,
        ['events', 'byKey', action.eventKey],
        action.data)
    case types.RECEIVE_YEAR_EVENTS:
      return updateMulti(
        state,
        ['events', 'collections', 'byYear', action.year],
        action.data)
    case types.RECEIVE_EVENT_MATCHES:
      return updateMulti(
        state,
        ['matches', 'collections', 'byEvent', action.eventKey],
        action.data)
    case types.RECEIVE_EVENT_TEAMS:
      return updateMulti(
        state,
        ['teams', 'collections', 'byEvent', action.eventKey],
        action.data)
    case types.RECEIVE_TEAM_LIST_PAGE:
      return updateMulti(
        state,
        ['teams', 'collections', 'byPage', action.pageNum],
        action.data)
    default:
      return state
  }
}
export default page
