import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import HomeIcon from '@material-ui/icons/Home'
import StarIcon from '@material-ui/icons/Star'
import VideocamIcon from '@material-ui/icons/Videocam'
import EventIcon from '@material-ui/icons/Event'
import PeopleIcon from '@material-ui/icons/People'
import SettingsIcon from '@material-ui/icons/Settings'
import List, { ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader } from 'material-ui/List'
import Switch from 'material-ui/Switch'
import Divider from 'material-ui/Divider'

const styles = theme => ({
  root: {
    marginTop: 64,
    overflowY: 'auto',
  },
  activeIcon: {
    color: theme.palette.primary.main,
  },
  activeText: {
    fontWeight: 600,
  },
})

class TBASideNavContent extends PureComponent {
  render() {
    console.log("Render TBASideNavContent")

    const {
      classes,
      navValue,
      apiEnabled,
      idbEnabled,
      toggleAPI,
      toggleIDB
    } = this.props

    return (
      <div className={classes.root} >
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon className={classNames({[classes.activeIcon]: navValue === 'home'})}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" classes={{primary: classNames({[classes.activeText]: navValue === 'home'})}}/>
          </ListItem>
          <ListItem button component={Link} to="/mytba">
            <ListItemIcon className={classNames({[classes.activeIcon]: navValue === 'mytba'})}>
              <StarIcon />
            </ListItemIcon>
            <ListItemText primary="myTBA" classes={{primary: classNames({[classes.activeText]: navValue === 'mytba'})}}/>
          </ListItem>
          <ListItem button component={Link} to="/gameday">
            <ListItemIcon className={classNames({[classes.activeIcon]: navValue === 'gameday'})}>
              <VideocamIcon />
            </ListItemIcon>
            <ListItemText primary="GameDay" classes={{primary: classNames({[classes.activeText]: navValue === 'gameday'})}}/>
          </ListItem>
          <ListItem button component={Link} to="/events">
            <ListItemIcon className={classNames({[classes.activeIcon]: navValue === 'events'})}>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Events" classes={{primary: classNames({[classes.activeText]: navValue === 'events'})}}/>
          </ListItem>
          <ListItem button component={Link} to="/teams">
            <ListItemIcon className={classNames({[classes.activeIcon]: navValue === 'teams'})}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Teams" classes={{primary: classNames({[classes.activeText]: navValue === 'teams'})}}/>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListSubheader>Temp for testing</ListSubheader>
          <ListItem>
            <ListItemText primary={apiEnabled ? "API Enabled" : "API Disabled"} />
            <ListItemSecondaryAction>
              <Switch
                onClick={toggleAPI}
                checked={apiEnabled}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary={idbEnabled ? "IDB Enabled" : "IDB Disabled"} />
            <ListItemSecondaryAction>
              <Switch
                onClick={toggleIDB}
                checked={idbEnabled}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </div>
    )
  }
}

export default withStyles(styles)(TBASideNavContent)
