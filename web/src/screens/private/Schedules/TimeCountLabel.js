import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';

import Tooltip from 'material-ui/Tooltip';

import convertStatus from '../../../selectors/status';

import styles from './TimeCountLabel.styles';

const TimeCountLabel = ({ classes, status, amount }) => {
  switch (convertStatus(status)) {
    case 'AV':
      return (
        <Tooltip title={`${amount} people available`}>
          <Avatar
            className={classes.avatarAV}
            style={amount === '0' ? { opacity: 0.35 } : { opacity: 1 }}
          >
            {amount}
          </Avatar>
        </Tooltip>
      );
    case 'UN':
      return (
        <Tooltip className={classes.tooltip} title={`${amount} people available`}>
          <Avatar
            className={classes.avatarUN}
            style={amount === '0' ? { opacity: 0.35 } : { opacity: 1 }}
          >
            {amount}
          </Avatar>
        </Tooltip>
      );
    case 'UR':
      return (
        <Tooltip className={classes.tooltip} title={`${amount} people available (if urgent)`}>
          <Avatar
            className={classes.avatarUR}
            style={amount === '0' ? { opacity: 0.35 } : { opacity: 1 }}
          >
            {amount}
          </Avatar>
        </Tooltip>
      );
    default:
      return <Avatar className={classes.avatarAV}>{amount}</Avatar>;
  }
};

TimeCountLabel.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(TimeCountLabel);
