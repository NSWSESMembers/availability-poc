import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import styles from '../../../../styles/AppStyle';

class UserLink extends React.Component {
  state = {
    anchorEl: null,
  };

  handlePopoverOpen = (event) => {
    this.setState({ anchorEl: event.target });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, timeSegments, user } = this.props;
    const { anchorEl } = this.state;
    const open = !!anchorEl;
    const notes = timeSegments.filter(timeSegment => timeSegment.note !== '');
    return (
      <React.Fragment>
        <Link to={`/users/${user.id}`}>{user.displayName}</Link>
        {notes.length > 0 && (
          <React.Fragment>
            <Icon
              className={classNames(classes.rightIcon, classes.iconSmall)}
              onMouseOver={this.handlePopoverOpen}
              onFocus={this.handlePopoverOpen}
              onMouseOut={this.handlePopoverClose}
              onBlur={this.handlePopoverClose}
            >
              event_note
            </Icon>
            <Popover
              className={classes.popover}
              classes={{
                paper: classes.paper,
              }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={this.handlePopoverClose}
              disableRestoreFocus
            >
              {notes.map(timeSegment => (
                <Typography key={timeSegment.startTime}>
                  <b>{moment.unix(timeSegment.startTime).format('LL')}</b>
                  <br />
                  {timeSegment.note}
                </Typography>
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
