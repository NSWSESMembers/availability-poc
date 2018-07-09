import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import styles from './FormGroupPanel.styles';

const FormGroupPanel = ({ classes, label, children }) => (
  <div className={classes.formGroupPanel}>
    {label && (
      <FormLabel component="legend" className={classes.formLabel}>
        {label}
      </FormLabel>
    )}
    {children}
  </div>
);

FormGroupPanel.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
  label: PropTypes.string,
};

export default withStyles(styles)(FormGroupPanel);
