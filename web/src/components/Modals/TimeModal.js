import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import { statusColor } from '../../selectors/status';

import styles from './TimeModal.styles';

class TimeModal extends React.Component {
  state = {
    newStartTime: '09:00',
    newEndTime: '17:00',
  };

  onStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    this.setState(() => ({ newStartTime }));
  };

  onEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    this.setState(() => ({ newEndTime }));
  };

  onSaveTime = () => {
    const startTime = moment(
      moment.unix(this.props.startTime).format('MM-DD-YYYY ') + this.state.newStartTime,
      'MM-DD-YYYY HH:mm',
    );
    const endTime = moment(
      moment.unix(this.props.startTime).format('MM-DD-YYYY ') + this.state.newEndTime,
      'MM-DD-YYYY HH:mm',
    );
    this.props.onSave(startTime, endTime, this.props.user.id, this.props.timeSegmentId);
  };

  onDeleteTime = () => {
    this.props.onDelete(this.props.timeSegmentId);
  };

  render() {
    const {
      classes,
      open,
      onCancel,
      user,
      status,
      startTime,
      timeSegmentId,
      timeSegmentStartTime,
      timeSegmentEndTime,
    } = this.props;
    return (
      <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <span style={{ color: statusColor(status) }}>
            {user && user.displayName} {status}
          </span>{' '}
          - {moment.unix(startTime).format('ddd, MMM D YYYY')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="time"
            label="Start Time"
            type="time"
            defaultValue={
                timeSegmentStartTime === 0 ?
                  this.state.newStartTime :
                  moment.unix(timeSegmentStartTime).format('HH:mm')
                }
            className={classes.textField}
            onChange={this.onStartTimeChange}
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
            defaultValue={
              timeSegmentEndTime === 0 ?
                this.state.newEndTime :
                moment.unix(timeSegmentEndTime).format('HH:mm')
            }
            className={classes.textField}
            onChange={this.onEndTimeChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 900, // 5 min
            }}
          />
        </DialogContent>
        <DialogActions>
          {
            timeSegmentId > 0 &&
            <Button onClick={this.onDeleteTime} color="primary">
              Delete
            </Button>
          }
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onSaveTime} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

TimeModal.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  open: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  // endTime: PropTypes.number.isRequired,
  timeSegmentId: PropTypes.number.isRequired,
  timeSegmentStartTime: PropTypes.number.isRequired,
  timeSegmentEndTime: PropTypes.number.isRequired,
};

export default withStyles(styles)(TimeModal);
