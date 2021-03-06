import React from 'react';
import PropTypes from 'prop-types';

import numeral from 'numeral';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { STATUS_AVAILABILITY, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../../config';
import styles from './TimeLabel.styles';

const TimeLabel = ({ classes, user, timeSegment, status, amount, time, margin, onOpenModal }) => {
  let avatarClass = classes.avatarAV;

  let timeStatus = status === undefined ? STATUS_AVAILABILITY : status;

  if (timeSegment !== undefined) {
    timeStatus = timeSegment.status;
  }

  switch (timeStatus) {
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
    <Button
      variant="raised"
      onClick={e => onOpenModal(e, user, timeSegment, time, status)}
      className={`${avatarClass} ${amount === 0 && 'semi-opaque'} ${margin &&
        classes.avatarMargin}`}
    >
      {numeral(amount).format('0[.]0')}
    </Button>
  );
};

TimeLabel.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}),
  amount: PropTypes.number.isRequired,
  margin: PropTypes.bool,
  status: PropTypes.string,
  time: PropTypes.number,
  timeSegment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    users: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  }),
  onOpenModal: PropTypes.func.isRequired,
};

TimeLabel.defaultProps = {
  margin: false,
};

export default withStyles(styles)(TimeLabel);
