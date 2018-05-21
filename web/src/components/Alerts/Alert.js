import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import styles from './Alert.styles';

const Alert = ({ classes, children }) => <div className={classes.warning}>{children}</div>;

Alert.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

export default withStyles(styles)(Alert);
