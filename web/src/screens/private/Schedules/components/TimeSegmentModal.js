import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';

import SCHEDULE_QUERY from '../../../../graphql/schedule.query';
import {
  CREATE_TIME_SEGMENT_MUTATION,
  REMOVE_TIME_SEGMENT_MUTATION,
  UPDATE_TIME_SEGMENT_MUTATION,
} from '../../../../graphql/time-segment.mutation';

import { closeTimeSegmentModal, setModalTimeSegment } from '../../../../actions/schedule';

import FormGroupPanel from '../../../../components/Panels/FormGroupPanel';
import Status from './Status';
import TimePicker from '../../../../components/Forms/TimePicker';

import { statusColor } from '../../../../selectors/status';

import styles from '../../../../styles/AppStyle';

const TimeSegmentModal = ({
  classes,
  createTimeSegment,
  dispatch,
  removeTimeSegment,
  timeSegments,
  updateTimeSegment,
}) => {
  const onChange = (e) => {
    const { status, startTime, endTime, note } = timeSegments.timeSegment;
    if (e.target.name === 'note') {
      dispatch(setModalTimeSegment(status, startTime, endTime, e.target.value));
    }
    if (e.target.name === 'status') {
      dispatch(setModalTimeSegment(e.target.value, startTime, endTime, note));
    }
    if (e.target.name === 'startTime' || e.target.name === 'endTime') {
      const currentDay = moment.unix(timeSegments.day);
      const updateTime = moment(
        currentDay.format('MM-DD-YYYY ') + e.target.value,
        'MM-DD-YYYY HH:mm',
      ).unix();
      if (e.target.name === 'startTime') {
        dispatch(setModalTimeSegment(status, updateTime, endTime, note));
      } else {
        dispatch(setModalTimeSegment(status, startTime, updateTime, note));
      }
    }
  };
  const onClose = () => dispatch(closeTimeSegmentModal());
  const onDelete = () => {
    const { scheduleId } = timeSegments;
    const { id: segmentId } = timeSegments.timeSegment;
    removeTimeSegment({ segmentId, scheduleId }).then(() => onClose());
  };
  const onSave = () => {
    const { scheduleId } = timeSegments;
    const { id: segmentId, status, startTime, endTime, note } = timeSegments.timeSegment;
    const { id } = timeSegments.user;

    const segment = {
      segmentId,
      userId: id,
      scheduleId,
      status,
      startTime,
      endTime,
      note,
    };

    if (segmentId === 0) {
      createTimeSegment(segment).then(() => onClose());
    } else {
      updateTimeSegment(segment).then(() => onClose());
    }
  };
  const day = moment.unix(timeSegments.day);
  const { id, status, startTime, endTime, note } = timeSegments.timeSegment;

  return (
    <Dialog
      open={timeSegments.open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ minWidth: 300 }}
    >
      <DialogTitle id="form-dialog-title">
        <span style={{ color: statusColor(status) }}>
          {timeSegments.user && timeSegments.user.displayName} {status}
        </span>{' '}
        - {day.format('ddd, MMM D YYYY')}
      </DialogTitle>
      <DialogContent>
        <Status value={status} onChange={onChange} />
        <FormGroupPanel label="Time Segment">
          <FormGroup row>
            <TimePicker label="Start Time" name="startTime" value={startTime} onChange={onChange} />
            <TimePicker label="End Time" name="endTime" value={endTime} onChange={onChange} />
          </FormGroup>
        </FormGroupPanel>
        <FormGroupPanel>
          <TextField
            name="note"
            label="Additional notes"
            className={classes.textField}
            value={note}
            onChange={onChange}
            margin="normal"
            multiline
          />
        </FormGroupPanel>
      </DialogContent>
      <DialogActions>
        {id > 0 && (
          <Button onClick={onDelete} color="primary">
            Delete
          </Button>
        )}
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const createTimeSegment = graphql(CREATE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    createTimeSegment: ({ userId, scheduleId, status, startTime, endTime, note }) =>
      mutate({
        variables: { timeSegment: { userId, scheduleId, status, startTime, endTime, note } },
        refetchQueries: [
          {
            query: SCHEDULE_QUERY,
            variables: { id: scheduleId },
          },
        ],
      }),
  }),
});

const removeTimeSegment = graphql(REMOVE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    removeTimeSegment: ({ segmentId, scheduleId }) =>
      mutate({
        variables: { timeSegment: { segmentId } },
        refetchQueries: [
          {
            query: SCHEDULE_QUERY,
            variables: { id: scheduleId },
          },
        ],
      }),
  }),
});

const updateTimeSegment = graphql(UPDATE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    updateTimeSegment: ({ segmentId, status, startTime, endTime, scheduleId, note }) =>
      mutate({
        variables: { timeSegment: { segmentId, status, startTime, endTime, note } },
        refetchQueries: [
          {
            query: SCHEDULE_QUERY,
            variables: { id: scheduleId },
          },
        ],
      }),
  }),
});

TimeSegmentModal.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  createTimeSegment: PropTypes.func,
  dispatch: PropTypes.func,
  removeTimeSegment: PropTypes.func,
  timeSegments: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    day: PropTypes.number.isRequired,
  }),
  updateTimeSegment: PropTypes.func,
};

const mapStateToProps = ({ auth, schedule }) => ({
  auth,
  timeSegments: schedule.timeSegments,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  createTimeSegment,
  removeTimeSegment,
  updateTimeSegment,
)(TimeSegmentModal);
