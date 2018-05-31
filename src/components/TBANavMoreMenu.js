import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import Avatar from '@material-ui/core/Avatar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import StarIcon from '@material-ui/icons/Star'
import SettingsIcon from '@material-ui/icons/Settings'
import VideocamIcon from '@material-ui/icons/Videocam'

const styles = {
}

class TBANavMoreMenu extends React.PureComponent {
  render() {
    const { anchorEl, open, handleClose, auth, promptSignInOutOpen } = this.props
    return (
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <div></div>{/* Captures focus to prevent ugly outline */}
        <MenuItem onClick={handleClose} component={Link} to='/mytba'>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText inset primary="myTBA" />
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} to='/gameday'>
          <ListItemIcon>
            <VideocamIcon />
          </ListItemIcon>
          <ListItemText inset primary="GameDay" />
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} to='/settings'>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText inset primary="Settings" />
        </MenuItem>
        <MenuItem
          button
          onClick={promptSignInOutOpen}
        >
          <Avatar>
            {auth.isEmpty ? <PersonIcon /> : <Avatar alt={auth.displayName} src={auth.photoURL} />}
          </Avatar>
          <ListItemText primary={`Sign ${auth.isEmpty ? 'In' : 'Out'}`} />
        </MenuItem>
      </Menu>
    )
  }
}

TBANavMoreMenu.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TBANavMoreMenu)
