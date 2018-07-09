import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';

import styles from '../../styles/AppStyle';

const TimePicker = ({ classes, label, name, value, onChange }) => (
  <TextField
    name={name}
    label={label}
    type="time"
    value={moment.unix(value).format('HH:mm')}
    onChange={onChange}
    className={classes.textField}
  />
);

TimePicker.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

export default withStyles(styles)(TimePicker);
