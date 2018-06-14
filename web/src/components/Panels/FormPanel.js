import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import styles from './FormPanel.styles';

const FormPanel = ({ classes, children }) => <div className={classes.formPanel}>{children}</div>;

FormPanel.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

export default withStyles(styles)(FormPanel);
