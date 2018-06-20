import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';

import { withStyles } from 'material-ui/styles';

import styles from '../../styles/AppStyle';

const DatePicker = ({ classes, label, name, value, onChange }) => (
  <TextField
    name={name}
    label={label}
    type="date"
    value={value}
    onChange={onChange}
    className={classes.textField}
  />
);

DatePicker.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default withStyles(styles)(DatePicker);

