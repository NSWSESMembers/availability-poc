import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';

import { closeTimeSegmentModal, setModalTimeSegment } from '../../../../actions/schedule';

import Status from './Status';
import TimePicker from '../../../../components/Forms/TimePicker';

import { statusColor } from '../../../../selectors/status';

import styles from '../../../../styles/AppStyle';

const TimeSegmentModal = ({ timeSegments, dispatch }) => {
  const onCloseModal = () => dispatch(closeTimeSegmentModal());
  const setStatus = (e) => {
    console.log(e.target.value);
    dispatch(setModalTimeSegment(e.target.value));
  };
  const startTime = moment.unix(timeSegments.day);
  return (
    <Dialog
      open={timeSegments.open}
      onClose={onCloseModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ minWidth: 300 }}
    >
      <DialogTitle id="form-dialog-title">
        <span style={{ color: statusColor(timeSegments.status) }}>
          {timeSegments.user && timeSegments.user.displayName} {timeSegments.status}
        </span>{' '}
        - {startTime.format('ddd, MMM D YYYY')}
      </DialogTitle>
      <DialogContent>
        <Status value={timeSegments.status} onChange={setStatus} />
        <FormGroup row>
          <TimePicker onChange={setStatus} />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseModal} color="primary">
          Cancel
        </Button>
        <Button onClick={onCloseModal} color="primary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TimeSegmentModal.propTypes = {
  dispatch: PropTypes.func,
  timeSegments: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    day: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }),
};

const mapStateToProps = ({ auth, schedule }) => ({
  auth,
  timeSegments: schedule.timeSegment,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(TimeSegmentModal);
