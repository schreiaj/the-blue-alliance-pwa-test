import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Observer from 'react-intersection-observer'
import { withStyles } from '@material-ui/core/styles'

import ButtonBase from '@material-ui/core/ButtonBase'
import ListSubheader from '@material-ui/core/ListSubheader'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import SweetScroll from 'sweet-scroll'

import ScrollLink from './ScrollLink'

const styles = theme => ({
  paper: {
    height: 50,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit*3}px`,
    position: 'sticky',
    top: 56 + 48 - 1,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      top: 48 + 48 - 1,
    },
    [theme.breakpoints.up('sm')]: {
      top: 64 + 48 - 1,
    },
    zIndex: theme.zIndex.appBar - 2,
    display: 'flex',
    flexDirection: 'row',
  },
  label: {
    flex: '1 1 auto',
  },
  observer: {
    position: 'absolute',
    top: -(56 + 48),
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      top: -(48 + 48),
    },
    [theme.breakpoints.up('sm')]: {
      top: -(64 + 48),
    },
  },
})

class EventPageSectionHeader extends PureComponent {
  state = {
    isRaised: false,
    anchorEl: null,
  }

  observerChange = (inView) => {
    this.setState({isRaised: !inView})
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleScroll = id => {
    const scroller = new SweetScroll({
      duration: 250,
      offset: -48,
    })
    scroller.to(`#${id}`)
    this.setState({ anchorEl: null })
  }

  render() {
    console.log("Render EventPageSectionHeader")

    const { classes, sectionKey, label, sections } = this.props
    const { isRaised, anchorEl } = this.state

    return (
      <React.Fragment>
        <ButtonBase
          onClick={this.handleClick}
          component={Paper}
          className={classes.paper}
          elevation={isRaised ? 4 : 0}
          square={isRaised}
        >
          <Observer
            className={classes.observer}
            tag="div"
            onChange={this.observerChange}
          />
          <Typography variant='title' className={classes.label}>{label}</Typography>
          <ExpandMore/>
        </ButtonBase>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          disableRestoreFocus
        >
          <ListSubheader component="div">Jump To:</ListSubheader>
          {sections.map(({ key, label }) => {
            return (
              <MenuItem
                key={key}
                onClick={this.handleScroll.bind(this, key)}
                selected={key === sectionKey}
              >
                {label}
              </MenuItem>
            )
          })}
        </Menu>
      </React.Fragment>
    )
  }
}

EventPageSectionHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
}

export default withStyles(styles)(EventPageSectionHeader)
