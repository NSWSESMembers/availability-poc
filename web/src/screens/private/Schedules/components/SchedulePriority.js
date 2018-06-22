import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

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

