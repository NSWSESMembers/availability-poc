import React from 'react';
import PropTypes from 'prop-types';

import numeral from 'numeral';

import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Tooltip from 'material-ui/Tooltip';

import { STATUS_AVAILABILITY, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../../config';
import styles from './TimeLabel.styles';

const TimeLabel = ({ classes, user, status, amount, startTime, endTime, onOpenModal }) => {
  let avatarClass = classes.avatarAV;

  switch (status) {
    case STATUS_AVAILABILITY:
      avatarClass = classes.avatarAV;
      break;
    case STATUS_UNAVAILABLE:
      avatarClass = classes.avatarUN;
      break;
    case STATUS_UNLESS_URGENT:
      avatarClass = classes.avatarUR;
      break;
    default:
      avatarClass = classes.avatarAV;
  }

  return (
    <Tooltip title={`add ${status.toLowerCase()} time`}>
      <Avatar
        className={`${avatarClass} ${amount === 0 && 'semi-opaque'}`}
        onClick={(e => onOpenModal(e, user, status, startTime, endTime))}
      >
        {numeral(amount).format('0[.]0')}
      </Avatar>
    </Tooltip>
  );
};

TimeLabel.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}),
  status: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  onOpenModal: PropTypes.func.isRequired,
};

export default withStyles(styles)(TimeLabel);

