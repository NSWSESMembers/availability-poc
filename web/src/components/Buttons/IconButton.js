import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import { withStyles } from '@material-ui/core/styles';

import styles from './IconButton.styles';

const IconButton = ({ classes, color, disabled, label, icon, position, onClick }) => (
  <Button
    variant="raised"
    size="small"
    color={color}
    className={classes.button}
    disabled={disabled}
    onClick={onClick}
  >
    {
        position === 'left' && icon &&
        <Icon className={classNames(classes.leftIcon, classes.iconSmall)}>{icon}</Icon>
    }
    {label}
    {
        position === 'right' && icon &&
        <Icon className={classNames(classes.rightIcon, classes.iconSmall)}>{icon}</Icon>
    }
  </Button>
);

IconButton.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  icon: PropTypes.string,
  position: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

IconButton.defaultProps = {
  color: 'default',
  disabled: false,
  position: 'left',
};

export default withStyles(styles)(IconButton);

