import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';

import { statusColor } from '../../selectors/status';
import { STATUS_AVAILABLE, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../../config';

import IconButton from '../Buttons/IconButton';

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
      {timeSegmentId > 0 && <IconButton label="Delete" onClick={onDelete} />}
      <IconButton label="Cancel" onClick={onClose} />
      <IconButton label="Save" onClick={onSave} color="primary" />
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
