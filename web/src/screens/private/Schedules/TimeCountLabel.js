import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import SentimentVeryDissatisfiedIcon from 'material-ui-icons/PersonOutline';
import Tooltip from 'material-ui/Tooltip';
import Badge from 'material-ui/Badge';
import PersonIcon from 'material-ui-icons/Person';

import { convertStatus } from '../../../selectors/status';

import styles from './TimeCountLabel.styles';

const TimeCountLabel = ({ classes, status, amount }) => {
  switch (convertStatus(status)) {
    case 'AV':
      return (
        // <Tooltip title={`${amount} people available`}>
        //   <Avatar
        //     className={classes.avatarAV}
        //     style={amount === '0' ? { opacity: 0.35 } : { opacity: 1 }}
        //   >
        //     <PersonIcon />
        //   </Avatar>
        // </Tooltip>

        <Badge className={classes.marginAV} badgeContent={amount}>
          <PersonIcon />
        </Badge>
      );
    case 'UN':
      return (
        // <Tooltip className={classes.tooltip} title={`${amount} people available`}>
        //   <Avatar
        //     className={classes.avatarUN}
        //     style={amount === '0' ? { opacity: 0.35 } : { opacity: 1 }}
        //   >
        //     <SentimentVeryDissatisfiedIcon />
        //   </Avatar>
        // </Tooltip>
        <Badge className={classes.marginUN} badgeContent={amount}>
          <PersonIcon />
        </Badge>
      );
    case 'UR':
      return (
        // <Tooltip className={classes.tooltip} title={`${amount} people available (if urgent)`}>
        //   <Avatar
        //     className={classes.avatarUR}
        //     style={amount === '0' ? { opacity: 0.35 } : { opacity: 1 }}
        //   >
        //     <PersonIcon />
        //   </Avatar>
        // </Tooltip>
        <Badge className={classes.marginUR} badgeContent={amount}>
          <PersonIcon />
        </Badge>
      );
    default:
      return <Avatar className={classes.avatarAV}>{amount}</Avatar>;
  }
};

TimeCountLabel.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(TimeCountLabel);
