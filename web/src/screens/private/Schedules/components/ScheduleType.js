import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import { SCHEDULE_TYPE_LOCAL, SCHEDULE_TYPE_REMOTE } from '../../../../config';

import { scheduleLabel } from '../../../../selectors/schedules';

import styles from '../../../../styles/AppStyle';

const ScheduleType = ({ classes, value, onChange }) => (
  <RadioGroup
    name="type"
    value={value}
    onChange={onChange}
    className={classes.radioButtonGroup}
  >
    <FormControlLabel
      value={SCHEDULE_TYPE_LOCAL}
      control={<Radio />}
      label={scheduleLabel(SCHEDULE_TYPE_LOCAL)}
    />
    <FormControlLabel
      value={SCHEDULE_TYPE_REMOTE}
      control={<Radio />}
      label={scheduleLabel(SCHEDULE_TYPE_REMOTE)}
    />
  </RadioGroup>
);

ScheduleType.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default withStyles(styles)(ScheduleType);

