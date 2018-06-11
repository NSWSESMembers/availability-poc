import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormControlLabel } from 'material-ui/Form';

import { statusColor } from '../../selectors/status';
import { STATUS_AVAILABLE, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../../config';

import styles from './TimeRangeModal.styles';

const TimeRangeModal = ({
  classes,
  open,
  startTime,
  endTime,
  status,
  title,
  user,
  timeSegmentId,
  onClose,
  onDelete,
  onSave,
  onStatusChange,
  onStartTimeChange,
  onEndTimeChange,
}) => (
  <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">
      <span style={{ color: statusColor(status) }}>
        {user && user.displayName} {status}
      </span>{' '}
      - {title}
    </DialogTitle>
    <DialogContent>
      <FormControl component="fieldset" required className={classes.formControl}>
        <RadioGroup
          aria-label="available"
          name="available"
          className={classes.group}
          value={status}
          onChange={onStatusChange}
        >
          <FormControlLabel value={STATUS_AVAILABLE} control={<Radio />} label={STATUS_AVAILABLE} />
          <FormControlLabel
            value={STATUS_UNAVAILABLE}
            control={<Radio />}
            label={STATUS_UNAVAILABLE}
          />
          <FormControlLabel
            value={STATUS_UNLESS_URGENT}
            control={<Radio />}
            label={STATUS_UNLESS_URGENT}
          />
        </RadioGroup>
      </FormControl>
      <div>
        <TextField
          autoFocus
          id="time"
          label="Start Time"
          type="time"
          className={classes.textField}
          defaultValue={startTime}
          onChange={onStartTimeChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 900, // 5 min
          }}
        />
        <TextField
          id="time"
          label="End Time"
          type="time"
          className={classes.textField}
          defaultValue={endTime}
          onChange={onEndTimeChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 900, // 5 min
          }}
        />
      </div>
    </DialogContent>
    <DialogActions>
      {timeSegmentId > 0 && (
        <Button onClick={onDelete} color="primary">
          Delete
        </Button>
      )}
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onSave} color="primary">
        Save
      </Button>
    </DialogActions>
  </Dialog>
);

TimeRangeModal.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  open: PropTypes.bool.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  status: PropTypes.string,
  title: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  timeSegmentId: PropTypes.number,
  onStatusChange: PropTypes.func.isRequired,
  onStartTimeChange: PropTypes.func.isRequired,
  onEndTimeChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default withStyles(styles)(TimeRangeModal);
