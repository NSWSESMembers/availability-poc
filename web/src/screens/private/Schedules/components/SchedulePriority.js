import React from 'react';
import PropTypes from 'prop-types';

import { FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';

import { withStyles } from 'material-ui/styles';

import styles from '../../../../styles/AppStyle';

const SchedulePriority = ({ classes, value, onChange }) => (
  <RadioGroup
    name="priority"
    value={value}
    onChange={onChange}
    className={classes.radioButtonGroup}
  >
    <FormControlLabel
      value="1"
      control={<Radio />}
      label="High"
    />
    <FormControlLabel
      value="2"
      control={<Radio />}
      label="Medium"
    />
    <FormControlLabel
      value="3"
      control={<Radio />}
      label="Low"
    />
  </RadioGroup>
);

SchedulePriority.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default withStyles(styles)(SchedulePriority);

