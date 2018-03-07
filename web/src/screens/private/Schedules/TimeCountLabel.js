import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import PersonIcon from 'material-ui-icons/Person';
import SentimentVeryDissatisfiedIcon from 'material-ui-icons/PersonOutline';
import SentimentNeutralIcon from 'material-ui-icons/PeopleOutline';

import Tooltip from 'material-ui/Tooltip';

import { convertStatus } from '../../../selectors/status';

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
            <PersonIcon />
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
            <SentimentVeryDissatisfiedIcon />
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
            <PersonIcon />
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
