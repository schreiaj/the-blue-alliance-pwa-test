import React, { Component } from 'react';
import classNames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import { withStyles } from 'material-ui/styles';
import Hidden from 'material-ui/Hidden';
import Tabs, { Tab } from 'material-ui/Tabs';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';
import EventIcon from 'material-ui-icons/Event';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import MatchTable from './MatchTable'
import MatchList from './MatchList'
import TeamsList from './TeamsList'

import TBAPageContainer from '../containers/TBAPageContainer'

const styles = theme => ({
  root: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 48px',
  },
  hidden: {
    display: 'none',
  }
})

class EventPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabIdx: 0,
    }
    this.props.resetPage()
  }

  componentDidMount() {
    this.refreshFunction()
  }

  refreshFunction = () => {
    this.props.fetchEventInfo(this.props.match.params.eventKey)
    this.props.fetchEventMatches(this.props.match.params.eventKey)
    this.props.fetchEventTeams(this.props.match.params.eventKey)
  }

  tabHandleChangeIndex = tabIdx => {
    this.setState({tabIdx});
  }

  tabHandleChange = (event, tabIdx) => {
    this.setState({tabIdx});
  }

  render() {
    console.log("Render Event Page")

    const event = this.props.event
    const matches = this.props.matches
    const teams = this.props.teams

    var name = null
    if (event) {
      name = event.get('name')
    }

    return (
      <div>
        <Hidden smDown>
          <TBAPageContainer
            refreshFunction={this.refreshFunction}
          >
            <div className={this.props.classes.root}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <h1>{name}</h1>
                </Grid>
                <Grid item xs={12}>
                  <Paper>
                    <Tabs
                      value={this.state.tabIdx}
                      onChange={this.tabHandleChange}
                      fullWidth
                    >
                      <Tab label="Results" />
                      <Tab label="Teams" />
                    </Tabs>
                  </Paper>
                  <div className={classNames({[this.props.classes.hidden]: this.state.tabIdx !== 0})}>
                    <Grid container spacing={24}>
                      <Grid item xs={6}>
                        <h3>Qualification Results</h3>
                        <MatchTable matches={matches} />
                      </Grid>
                      <Grid item xs={6}>
                        <h3>Playoff Results</h3>
                        <MatchTable matches={matches} />
                      </Grid>
                    </Grid>
                  </div>
                  <div className={classNames({[this.props.classes.hidden]: this.state.tabIdx !== 1})}>
                    TEAMS!
                  </div>
                </Grid>
              </Grid>
            </div>
          </TBAPageContainer>
        </Hidden>
        <Hidden mdUp>
          <TBAPageContainer
            title={name}
            refreshFunction={this.refreshFunction}
            tabs={
              <Tabs
                value={this.state.tabIdx}
                onChange={this.tabHandleChange}
                indicatorColor="white"
                scrollable
                scrollButtons="auto"
              >
                <Tab label={"Info"} />
                <Tab label={"Matches"} />
                <Tab label={"Teams"} />
              </Tabs>
            }
          >
            <SwipeableViews
              containerStyle={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              }}
              index={this.state.tabIdx}
              onChangeIndex={this.tabHandleChangeIndex}
            >
              <div>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <InfoOutlineIcon />
                    </ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                </List>
                <Divider />
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dates go here" />
                  </ListItem>
                </List>
              </div>
              <MatchList matches={matches} />
              <TeamsList teams={teams} />
            </SwipeableViews>
          </TBAPageContainer>
        </Hidden>
      </div>
    )

  }
}

export default withStyles(styles)(EventPage);
