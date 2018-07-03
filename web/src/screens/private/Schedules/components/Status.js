import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import styles from '../../../../styles/AppStyle';

import { STATUS_AVAILABLE, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../../../../config';

const Status = ({ value, onChange }) => (
  <FormGroup row>
    <RadioGroup
      aria-label="status"
      name="status"
      style={{ display: 'block' }}
      value={value}
      onChange={onChange}
    >
      <FormControlLabel value={STATUS_AVAILABLE} control={<Radio />} label={STATUS_AVAILABLE} />
      <FormControlLabel value={STATUS_UNAVAILABLE} control={<Radio />} label={STATUS_UNAVAILABLE} />
      <FormControlLabel
        value={STATUS_UNLESS_URGENT}
        control={<Radio />}
        label={STATUS_UNLESS_URGENT}
      />
    </RadioGroup>
  </FormGroup>
);

Status.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Status);
