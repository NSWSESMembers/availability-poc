import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import convertStatus from '../../../selectors/status';
import styles from './TimeLabel.styles';

const TimeLabel = ({ classes, status, startTime, endTime }) => (
  <Chip
    avatar={
      <Avatar className={convertStatus(status) === 'AV' ? classes.avatarAV : classes.avatarUN}>
        {convertStatus(status)}
      </Avatar>
    }
    label={`${moment.unix(startTime).format('h:mma')} - ${moment.unix(endTime).format('h:mma')}`}
    className={convertStatus(status) === 'AV' ? classes.chipAV : classes.chipUN}
  />
);

TimeLabel.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  status: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
};

export default withStyles(styles)(TimeLabel);
