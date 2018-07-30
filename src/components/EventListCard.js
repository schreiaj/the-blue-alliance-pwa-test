import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import EventListCardHeader from './EventListCardHeader'
import VisibilityRenderer from './VisibilityRenderer'

const styles = theme => ({
  eventListCard: {
    marginBottom: theme.spacing.unit*3,
  },
  eventListItem: {
    height: 60,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit*3}px`,
  },
  eventListItemInvisibleWithoutDivider: {
    height: 60,
  },
  eventListItemInvisible: {
    height: 61,
  },
  hiddenDivider: {
    display: 'none',
  },
  verticalCenter: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
})

class EventListCard extends PureComponent {
  render() {
    console.log("Render EventListCard")

    const { classes, events, label } = this.props

    return (
      <Paper className={classes.eventListCard} elevation={4}>
        <EventListCardHeader label={label}/>
        {events.map((event, i) => {
          return (
            <VisibilityRenderer
              key={event.key}
              render={
                <React.Fragment>
                  <div className={classes.eventListItem}>
                    <Grid container spacing={24}>
                      <Grid item xs={9}>
                        <div className={classes.verticalCenter}>
                          <Typography variant='subheading' noWrap>
                            <Link to={`/event/${event.key}`}>{event.name}</Link>
                          </Typography>
                          <Typography variant='body1'>
                            {event.getCityStateCountry()}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='body1' align='right' className={classes.verticalCenter}>
                          {event.getDateString()}
                        </Typography>
                      </Grid>
                      {/*<Grid item xs={1}>
                        <Tooltip title='Event webcast is offline' placement='right'>
                          <IconButton color='default' disabled>
                            <Icon>videocam_off</Icon>
                          </IconButton>
                        </Tooltip>
                      </Grid>*/}
                    </Grid>
                  </div>
                  <Divider className={events.size === i + 1 ? classes.hiddenDivider : null}/>
                </React.Fragment>
              }
              fastRender={
                events.size ===  i + 1 ?
                <div className={classes.eventListItemInvisibleWithoutDivider} />
                :
                <div className={classes.eventListItemInvisible} />
              }
            />
          )
        })}
      </Paper>
    )
  }
}

EventListCard.propTypes = {
  classes: PropTypes.object.isRequired,
  events: ImmutablePropTypes.list,
  label: PropTypes.string.isRequired,
}

export default withStyles(styles)(EventListCard)
