import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import styles from './SpreadPanel.styles';

const SpreadPanel = ({ classes, children }) => <div className={classes.titlePanel}>{children}</div>;

SpreadPanel.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

export default withStyles(styles)(SpreadPanel);
