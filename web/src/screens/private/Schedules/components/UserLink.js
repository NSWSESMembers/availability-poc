import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import { TIME_SEGMENT_TYPE_AVAILABILITY, TIME_SEGMENT_TYPE_DEPLOYMENT } from '../../../../config';

import styles from '../../../../styles/AppStyle';

class UserLink extends React.Component {
  state = {
    anchorDeploy: null,
    anchorNote: null,
  };

  onDeployOpen = (event) => {
    this.setState({ anchorDeploy: event.target });
  };

  onDeployClose = () => {
    this.setState({ anchorDeploy: null });
  };

  onNoteOpen = (event) => {
    this.setState({ anchorNote: event.target });
  };

  onNoteClose = () => {
    this.setState({ anchorNote: null });
  };

  render() {
    const { classes, timeSegments, user } = this.props;
    const { anchorNote, anchorDeploy } = this.state;
    const openNote = !!anchorNote;
    const openDeploy = !!anchorDeploy;
    const notes = timeSegments.filter(
      timeSegment => timeSegment.type === TIME_SEGMENT_TYPE_AVAILABILITY && timeSegment.note !== '',
    );
    const deploys = timeSegments.filter(
      timeSegment => timeSegment.type === TIME_SEGMENT_TYPE_DEPLOYMENT,
    );
    return (
      <React.Fragment>
        <Link to={`/users/${user.id}`}>{user.displayName}</Link>
        {notes.length > 0 && (
          <React.Fragment>
            <Icon
              className={classNames(classes.rightIcon, classes.iconSmall)}
              onMouseOver={this.onNoteOpen}
              onFocus={this.onNoteOpen}
              onMouseOut={this.onNoteClose}
              onBlur={this.onNoteClose}
            >
              event_note
            </Icon>
            <Popover
              className={classes.popover}
              classes={{
                paper: classes.paper,
              }}
              open={openNote}
              anchorEl={anchorNote}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={this.onNoteClose}
              disableRestoreFocus
            >
              <Typography variant="title" gutterBottom>
                Notes
              </Typography>
              {notes.map(timeSegment => (
                <Typography variant="body1" gutterBottom key={`note${timeSegment.startTime}`}>
                  <b>{moment.unix(timeSegment.startTime).format('LLL')}</b>
                  &nbsp;to&nbsp;
                  <b>{moment.unix(timeSegment.endTime).format('LLL')}</b>
                  {timeSegment.note !== '' && (
                    <Typography variant="caption" gutterBottom>
                      {timeSegment.note}
                    </Typography>
                  )}
                </Typography>
              ))}
            </Popover>
          </React.Fragment>
        )}
        {deploys.length > 0 && (
          <React.Fragment>
            <Icon
              className={classNames(classes.rightIcon, classes.iconSmall)}
              onMouseOver={this.onDeployOpen}
              onFocus={this.onDeployOpen}
              onMouseOut={this.onDeployClose}
              onBlur={this.onDeployClose}
            >
              local_airport
            </Icon>
            <Popover
              className={classes.popover}
              classes={{
                paper: classes.paper,
              }}
              open={openDeploy}
              anchorEl={anchorDeploy}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={this.onDeployClose}
              disableRestoreFocus
            >
              <Typography variant="title" gutterBottom>
                On Deployment
              </Typography>
              {deploys.map(timeSegment => (
                <React.Fragment key={`deploy${timeSegment.startTime}`}>
                  <Typography variant="body1" gutterBottom>
                    <b>{moment.unix(timeSegment.startTime).format('LL')}</b>
                    &nbsp;to&nbsp;
                    <b>{moment.unix(timeSegment.endTime).format('LL')}</b>&nbsp;
                    {timeSegment.note !== '' && (
                      <Typography variant="caption" gutterBottom>
                        {timeSegment.note}
                      </Typography>
                    )}
                  </Typography>
                  {timeSegment.tags.map(tag => (
                    <Chip
                      key={`chiphover-${timeSegment.user.id}-${timeSegment.id}-${tag.id}`}
                      label={tag.name}
                      className={classes.chip}
                    />
                  ))}
                </React.Fragment>
              ))}
            </Popover>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

UserLink.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  timeSegments: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired,
    }),
  ),
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    displayName: PropTypes.string.isRequired,
  }),
};

export default withStyles(styles)(UserLink);
