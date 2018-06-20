import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import styles from './ButtonPanel.styles';

const ButtonPanel = ({ classes, children }) => (
  <div className={classes.buttonPanel}>{children}</div>
);

ButtonPanel.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

export default withStyles(styles)(ButtonPanel);
