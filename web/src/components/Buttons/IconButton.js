import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import { withStyles } from '@material-ui/core/styles';

import styles from './IconButton.styles';

const IconButton = ({ classes, label, icon, onClick }) => (
  <Button variant="raised" size="small" color="primary" className={classes.button} onClick={onClick}>
    <Icon className={classNames(classes.leftIcon, classes.iconSmall)}>{icon}</Icon>
    Edit
  </Button>
);

IconButton.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  label: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(IconButton);

