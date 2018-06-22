import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import styles from './CenterPanel.styles';

const CenterPanel = ({ classes, children }) => (
  <div className={classes.centerPanel}>{children}</div>
);

CenterPanel.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

export default withStyles(styles)(CenterPanel);
