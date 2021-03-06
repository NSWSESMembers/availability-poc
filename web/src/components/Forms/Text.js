import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';

import { withStyles } from '@material-ui/core/styles';

import styles from '../../styles/AppStyle';

const Text = ({ classes, label, name, value, required, onChange }) => (
  <Input
    required={required}
    name={name}
    placeholder={label}
    type="text"
    value={value}
    onChange={onChange}
    className={classes.textField}
  />
);

Text.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

Text.defaultProps = {
  required: false,
};

export default withStyles(styles)(Text);
