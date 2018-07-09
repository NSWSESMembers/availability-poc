import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

import { withStyles } from '@material-ui/core/styles';

import styles from '../../styles/AppStyle';

const TextSearch = ({ classes, name, value, onChange }) => (
  <Input
    name={name}
    type="text"
    value={value}
    onChange={onChange}
    className={classes.textField}
    startAdornment={
      <InputAdornment position="start">
        <Search color="disabled" />
      </InputAdornment>
    }
  />
);

TextSearch.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default withStyles(styles)(TextSearch);
