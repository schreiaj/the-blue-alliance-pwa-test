import * as types from '../constants/ActionTypes';
import * as sources from '../constants/DataSources'
import { List, Map, Set, fromJS } from 'immutable';

const updateFromSource = (state = Map({
  data: Map(),
  source: sources.DEFAULT,
}), action) => {
  if (action.source > state.get('source') || true) {
    return state
      .set('data', state.get('data').mergeDeep(action.data))
      .set('source', action.source)
  }
  return state
}

const updateSetFromSource = (state = Map({
  data: Set(),
  source: sources.DEFAULT,
}), action) => {
  if (action.source > state.get('source') || true) {
    const newSet = fromJS(action.data).toSet()
    const toAdd = newSet.subtract(state.get('data'))
    return state
      .set('data', state.get('data').intersect(newSet).union(toAdd))
      .set('source', action.source)
  }
  return state
}

const page = (state = Map(), action) => {
  switch (action.type) {
    case types.RECEIVE_EVENT_INFO:
      return state.set('event', updateFromSource(state.get('event'), action))
    case types.RECEIVE_YEAR_EVENTS:
      return state.set('events', updateSetFromSource(state.get('events'), action))
    case types.RECEIVE_EVENT_TEAMS:
      return state.set('eventTeams', updateSetFromSource(state.get('eventTeams'), action))
    case types.RECEIVE_TEAM_INFO:
      return state.set('team', updateFromSource(state.get('team'), action))
    case types.RECEIVE_TEAM_LIST_PAGE:
      return state.setIn(['teams', action.pageNum], updateSetFromSource(state.getIn(['teams', action.pageNum]), action))
    case types.RECEIVE_TEAM_YEAR_EVENTS:
      return state.set('teamYearEvents', updateSetFromSource(state.get('teamYearEvents'), action))
    default:
      return state
  }
}
export default page