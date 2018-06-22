import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

import styles from '../../../styles/AppStyle';

import DayWeek from './components/DayWeek';
import ScheduleHeader from './components/ScheduleHeader';
import TableNextPrevious from '../../../components/Tables/TableNextPrevious';
import SpreadPanel from '../../../components/Panels/SpreadPanel';
import ScheduleDay from './components/ScheduleDay';
import TimeRangeModal from '../../../components/Modals/TimeRangeModal';

import SCHEDULE_QUERY from '../../../graphql/schedule.query';
import {
  CREATE_TIME_SEGMENT_MUTATION,
  REMOVE_TIME_SEGMENT_MUTATION,
  UPDATE_TIME_SEGMENT_MUTATION,
} from '../../../graphql/time-segment.mutation';

import { STATUS_AVAILABLE } from '../../../config';
import { DEFAULT_START_TIME, DEFAULT_END_TIME } from '../../../constants';

class ViewScheduleDay extends React.Component {
  state = {
    modalOpen: false,
    modalTimeSegmentId: 0,
    modalTitle: '',
    modalUser: undefined,
    modalStatus: STATUS_AVAILABLE,
    modalStartTime: DEFAULT_START_TIME,
    modalEndTime: DEFAULT_END_TIME,
  };

  onNextDateRange = () => {
    const currentDay = moment.unix(parseInt(this.props.match.params.time, 10));
    currentDay.add(1, 'days');
    const { history } = this.props;
    history.push(`/schedules/${this.props.match.params.id}/${currentDay.unix()}`);
  };

  onPreviousDateRange = () => {
    const currentDay = moment.unix(parseInt(this.props.match.params.time, 10));
    currentDay.add(-1, 'days');
    const { history } = this.props;
    history.push(`/schedules/${this.props.match.params.id}/${currentDay.unix()}`);
  };

  onModalStartTimeChange = (e) => {
    this.setState({ modalStartTime: e.target.value });
  };

  onModalEndTimeChange = (e) => {
    this.setState({ modalEndTime: e.target.value });
  };

  onModalStatusChange = (e) => {
    this.setState({ modalStatus: e.target.value });
  };

  onModalClose = () => {
    this.setState({ modalOpen: false });
  };

  onModalOpen = (e, user, timeSegment, time) => {
    if (timeSegment !== undefined) {
      this.setState({
        modalOpen: true,
        modalTimeSegmentId: timeSegment.id,
        modalTitle: moment.unix(timeSegment.startTime).format('ddd, MMM D YYYY'),
        modalUser: user,
        modalStatus: timeSegment.status,
        modalStartTime: moment.unix(timeSegment.startTime).format('HH:mm'),
        modalEndTime: moment.unix(timeSegment.endTime).format('HH:mm'),
      });
    } else {
      const startTime = moment.unix(time).format('HH:mm');
      const endTime = moment
        .unix(time)
        .add(1, 'hours')
        .format('HH:mm');
      this.setState({
        modalOpen: true,
        modalTimeSegmentId: 0,
        modalStatus: STATUS_AVAILABLE,
        modalTitle: moment
          .unix(parseInt(this.props.match.params.time, 10))
          .format('ddd, MMM D YYYY'),
        modalUser: user,
        modalStartTime: startTime,
        modalEndTime: endTime,
      });
    }
  };

  onModalSave = () => {
    const { createTimeSegment, updateTimeSegment } = this.props;
    const { modalTimeSegmentId, modalStatus, modalStartTime, modalEndTime, modalUser } = this.state;

    // get start of day
    const currentDay = moment.unix(parseInt(this.props.match.params.time, 10));

    // get adjusted start & end times
    const startTime = moment(currentDay.format('MM-DD-YYYY ') + modalStartTime, 'MM-DD-YYYY HH:mm');
    const endTime = moment(currentDay.format('MM-DD-YYYY ') + modalEndTime, 'MM-DD-YYYY HH:mm');

    if (modalTimeSegmentId > 0) {
      updateTimeSegment({
        scheduleId: parseInt(this.props.match.params.id, 10),
        segmentId: modalTimeSegmentId,
        status: modalStatus,
        startTime: moment(startTime).unix(),
        endTime: moment(endTime).unix(),
      });
    } else {
      createTimeSegment({
        userId: modalUser.id,
        scheduleId: parseInt(this.props.match.params.id, 10),
        status: this.state.modalStatus,
        startTime: moment(startTime).unix(),
        endTime: moment(endTime).unix(),
      });
    }

    this.setState({ modalOpen: false });
  };

  onModalDelete = () => {
    const { modalTimeSegmentId } = this.state;

    if (modalTimeSegmentId > 0) {
      this.props.removeTimeSegment({
        scheduleId: parseInt(this.props.match.params.id, 10),
        segmentId: modalTimeSegmentId,
      });
    }

    this.setState({ modalOpen: false });
  };

  onWeek = () => {
    const { history } = this.props;
    history.push(`/schedules/${this.props.schedule.id.toString()}`);
  };

  render() {
    const { classes, loading, schedule } = this.props;

    if (loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const day = parseInt(this.props.match.params.time, 10);

    const users = this.props.schedule.group.users.map(u => ({
      id: u.id,
      displayName: u.displayName,
      timeSegments: schedule.timeSegments.filter(ts => u.id === ts.user.id),
    }));

    const scheduleStart = moment
      .unix(schedule.startTime)
      .startOf('day')
      .unix();
    const scheduleEnd = moment
      .unix(schedule.endTime)
      .startOf('day')
      .unix();

    return (
      <div className={classes.root}>
        <ScheduleHeader schedule={schedule} />
        <Paper className={classes.paperMargin}>
          <SpreadPanel>
            <DayWeek dayDisabled weekDisabled={false} onWeek={this.onWeek} />
            <TableNextPrevious
              hasNext={scheduleEnd > day}
              hasPrevious={scheduleStart < day}
              pressNext={this.onNextDateRange}
              pressPrevious={this.onPreviousDateRange}
            />
          </SpreadPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          <ScheduleDay users={users} day={day} onEdit={this.onModalOpen} />
        </Paper>
        <TimeRangeModal
          open={this.state.modalOpen}
          status={this.state.modalStatus}
          startTime={this.state.modalStartTime}
          endTime={this.state.modalEndTime}
          timeSegmentId={this.state.modalTimeSegmentId}
          title={this.state.modalTitle}
          user={this.state.modalUser}
          onClose={this.onModalClose}
          onSave={this.onModalSave}
          onDelete={this.onModalDelete}
          onStartTimeChange={this.onModalStartTimeChange}
          onEndTimeChange={this.onModalEndTimeChange}
          onStatusChange={this.onModalStatusChange}
        />
      </div>
    );
  }
}

ViewScheduleDay.propTypes = {
  history: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      time: PropTypes.string,
    }).isRequired,
  }).isRequired,
  schedule: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string,
    group: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      users: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          username: PropTypes.string.isRequired,
          displayName: PropTypes.string,
        }),
      ),
    }),
    timeSegments: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string.isRequired,
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
        users: PropTypes.shape({
          id: PropTypes.number.isRequired,
        }),
      }),
    ),
  }),
  createTimeSegment: PropTypes.func.isRequired,
  removeTimeSegment: PropTypes.func.isRequired,
  updateTimeSegment: PropTypes.func.isRequired,
};

const scheduleQuery = graphql(SCHEDULE_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ownProps => ({
    variables: { id: ownProps.match.params.id },
    // fetchPolicy: 'network-only',
  }),
  props: ({ data: { loading, schedule } }) => ({
    schedule,
    loading,
  }),
});

const createTimeSegment = graphql(CREATE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    createTimeSegment: ({ userId, scheduleId, status, startTime, endTime }) =>
      mutate({
        variables: { timeSegment: { userId, scheduleId, status, startTime, endTime } },
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
    updateTimeSegment: ({ segmentId, status, startTime, endTime, scheduleId }) =>
      mutate({
        variables: { timeSegment: { segmentId, status, startTime, endTime } },
        refetchQueries: [
          {
            query: SCHEDULE_QUERY,
            variables: { id: scheduleId },
          },
        ],
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  scheduleQuery,
  createTimeSegment,
  removeTimeSegment,
  updateTimeSegment,
)(ViewScheduleDay);
