import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import PersonIcon from 'material-ui-icons/Person';

import { convertStatus } from '../../../../selectors/status';

import styles from './TimeCountLabel.styles';

const TimeCountLabel = ({ classes, status, amount }) => {
  switch (convertStatus(status)) {
    case 'AV':
      return (
        <Badge className={classes.marginAV} badgeContent={amount}>
          <PersonIcon />
        </Badge>
      );
    case 'UN':
      return (
        <Badge className={classes.marginUN} badgeContent={amount}>
          <PersonIcon />
        </Badge>
      );
    case 'UR':
      return (
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
