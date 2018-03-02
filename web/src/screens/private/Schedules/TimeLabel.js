import React from 'react';
import moment from 'moment';
import numeral from 'numeral';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';

import convertStatus from '../../../selectors/status';
import styles from './TimeLabel.styles';

const TimeLabel = ({ classes, status, startTime, endTime, onClick }) => {
  const hours = moment.duration(moment.unix(endTime).diff(moment.unix(startTime))).asHours();

  switch (convertStatus(status)) {
    case 'AV':
      return (
        <Avatar className={classes.avatarAV} onClick={onClick}>
          {numeral(hours).format('0[.]0')}
        </Avatar>
      );
    case 'UN':
      return (
        <Avatar className={classes.avatarUN} onClick={onClick}>
          {numeral(hours).format('0[.]0')}
        </Avatar>
      );
    case 'UR':
      return (
        <Avatar className={classes.avatarUR} onClick={onClick}>
          {numeral(hours).format('0[.]0')}
        </Avatar>
      );
    default:
      return (
        <Avatar className={classes.avatarAV} onClick={onClick}>
          {numeral(hours).format('0[.]0')}
        </Avatar>
      );
  }
};

TimeLabel.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  status: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

export default withStyles(styles)(TimeLabel);
