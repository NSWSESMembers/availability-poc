import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Table, { TableHead, TableBody, TableCell, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

import { STATUS_AVAILABLE, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../../../config';
import { DEFAULT_START_TIME, DEFAULT_END_TIME } from '../../../constants';

import { peopleCount } from '../../../selectors/timeSegments';
import { dateColumns } from '../../../selectors/dates';

import SCHEDULE_QUERY from '../../../graphql/schedule.query';
import {
  CREATE_TIME_SEGMENT_MUTATION,
  REMOVE_TIME_SEGMENT_MUTATION,
  UPDATE_TIME_SEGMENT_MUTATION,
} from '../../../graphql/time-segment.mutation';

import DayWeek from './components/DayWeek';
import TimeCountLabel from './components/TimeCountLabel';
import ScheduleWeekItem from './components/ScheduleWeekItem';
import TableNextPrevious from '../../../components/Tables/TableNextPrevious';
import ScheduleHeader from './components/ScheduleHeader';
import SpreadPanel from '../../../components/Panels/SpreadPanel';
import TimeRangeModal from '../../../components/Modals/TimeRangeModal';

import styles from '../../../styles/AppStyle';

class ViewSchedule extends React.Component {
  state = {
    startTimeRange: moment().isoWeekday(1).startOf('week')
      .add(1, 'days')
      .unix(),
    endTimeRange: moment().isoWeekday(1).startOf('week').add(8, 'days')
      .unix(),
    modalOpen: false,
    modalUser: undefined,
    modalTimeSegmentId: 0,
    modalStatus: STATUS_AVAILABLE,
    modalStartTime: DEFAULT_START_TIME,
    modalEndTime: DEFAULT_END_TIME,
    modalTitle: '',
    modalTime: 0,
  };

  onDay = () => {
    const { history } = this.props;
    history.push(`/schedules/${this.props.match.params.id}/${this.state.startTimeRange}`);
  }

  onModalStartTimeChange = (e) => {
    this.setState({ modalStartTime: e.target.value });
  };

  onModalEndTimeChange = (e) => {
    this.setState({ modalEndTime: e.target.value });
  };

  onModalStatusChange = (e) => {
    this.setState({ modalStatus: e.target.value });
  };

  onModalOpen = (e, user, timeSegment, time, status) => {
    if (timeSegment !== undefined) {
      this.setState({
        modalOpen: true,
        modalTimeSegmentId: timeSegment.id,
        modalTitle: moment.unix(timeSegment.startTime).format('ddd, MMM D YYYY'),
        modalUser: user,
        modalStatus: timeSegment.status,
        modalStartTime: moment.unix(timeSegment.startTime).format('HH:mm'),
        modalEndTime: moment.unix(timeSegment.endTime).format('HH:mm'),
        modalTime: time,
      });
    } else {
      this.setState({
        modalOpen: true,
        modalTimeSegmentId: 0,
        modalStatus: status,
        modalTitle: moment
          .unix(parseInt(time, 10))
          .format('ddd, MMM D YYYY'),
        modalUser: user,
        modalStartTime: DEFAULT_START_TIME,
        modalEndTime: DEFAULT_END_TIME,
        modalTime: time,
      });
    }
  };

  onModalClose = () => {
    this.setState({ modalOpen: false });
  };

  onModalSave = () => {
    const { createTimeSegment, updateTimeSegment } = this.props;
    const {
      modalTimeSegmentId,
      modalStatus,
      modalStartTime,
      modalEndTime,
      modalUser,
      modalTime,
    } = this.state;

    // get start of day
    const currentDay = moment.unix(parseInt(modalTime, 10));

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

  onNextDateRange = () => {
    const nextStartTimeRange = moment.unix(this.state.startTimeRange).add(7, 'days').unix();
    const nextEndTimeRange = moment.unix(this.state.endTimeRange).add(7, 'days').unix();

    this.setState({
      startTimeRange: nextStartTimeRange,
      endTimeRange: nextEndTimeRange,
    });
  };

  onPreviousDateRange = () => {
    const previousStartTimeRange = moment.unix(this.state.startTimeRange).add(-7, 'days').unix();
    const previousEndTimeRange = moment.unix(this.state.endTimeRange).add(-7, 'days').unix();

    this.setState({
      startTimeRange: previousStartTimeRange,
      endTimeRange: previousEndTimeRange,
    });
  };

  render() {
    const { classes, loading, schedule } = this.props;

    if (loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }
    const columnData = dateColumns(moment.unix(this.state.startTimeRange),
      moment.unix(this.state.endTimeRange));

    const scheduleStart = moment.unix(schedule.startTime).startOf('day').unix();
    const scheduleEnd = moment.unix(schedule.endTime).startOf('day').unix();

    return (
      <div className={classes.root}>
        <ScheduleHeader schedule={schedule} />
        <Paper className={classes.paperMargin}>
          <SpreadPanel>
            <DayWeek dayDisabled={false} weekDisabled onDay={this.onDay} />
            <TableNextPrevious
              hasNext={scheduleEnd > this.state.endTimeRange}
              hasPrevious={scheduleStart < this.state.startTimeRange}
              pressNext={this.onNextDateRange}
              pressPrevious={this.onPreviousDateRange}
            />
          </SpreadPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {columnData.map((column) => {
                  if (column.id === 'name') {
                    return (
                      <TableCell key={column.id} className={classes.tableCellHeaderFirst}>
                        Totals
                      </TableCell>
                    );
                  }
                  if (
                    column.startTime < scheduleStart ||
                    column.startTime > scheduleEnd
                  ) {
                    return (
                      <TableCell key={column.id} className={classes.tableCellHeaderDisabled} />
                    );
                  }
                  const amountAvailable = peopleCount(schedule.timeSegments, {
                    status: STATUS_AVAILABLE,
                    startTime: column.startTime,
                    endTime: column.endTime,
                  });
                  const amountUnvailable = peopleCount(schedule.timeSegments, {
                    status: STATUS_UNAVAILABLE,
                    startTime: column.startTime,
                    endTime: column.endTime,
                  });
                  const amountUrgent = peopleCount(schedule.timeSegments, {
                    status: STATUS_UNLESS_URGENT,
                    startTime: column.startTime,
                    endTime: column.endTime,
                  });

                  return (
                    <TableCell
                      key={column.id}
                      className={classes.tableCellHeader}
                      style={{ paddingRight: 0 }}
                    >
                      <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <TimeCountLabel
                          status={STATUS_AVAILABLE}
                          amount={amountAvailable.toString()}
                        />
                        <TimeCountLabel
                          status={STATUS_UNAVAILABLE}
                          amount={amountUnvailable.toString()}
                        />
                        <TimeCountLabel
                          status={STATUS_UNLESS_URGENT}
                          amount={amountUrgent.toString()}
                        />
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                {columnData.map(
                  (column) => {
                    if (column.id === 'name') {
                      return (
                        <TableCell key={column.id} className={classes.tableCellHeaderFirst}>
                          {column.label}
                        </TableCell>
                      );
                    }
                    return column.startTime >= scheduleStart &&
                      column.startTime <= scheduleEnd ? (
                        <TableCell
                          key={column.id}
                          className={classes.tableCellHeader}
                          style={{ paddingRight: 0 }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Link to={`/schedules/${schedule.id}/${column.startTime}`}>{column.label}</Link>
                          </div>
                        </TableCell>
                    ) : (
                      <TableCell
                        key={`vsi-${column.startTime}`}
                        className={classes.tableCellHeaderDisabled}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {column.label}
                        </div>
                      </TableCell>
                    );
                  },
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.group.users.map(user => (
                <TableRow key={user.id}>
                  {columnData.map((column) => {
                    if (column.id === 'name') {
                      return (
                        <TableCell key={user.id} className={classes.tableCellFirst}>
                          <Link to="/dashboard">{user.displayName}</Link>
                        </TableCell>
                      );
                    }
                    return column.startTime >= scheduleStart &&
                      column.startTime <= scheduleEnd ? (
                        <ScheduleWeekItem
                          key={`vsi-${user.id}-${column.startTime}`}
                          user={user}
                          startTime={column.startTime}
                          endTime={column.endTime}
                          onOpenModal={this.onModalOpen}
                          timeSegments={schedule.timeSegments}
                        />
                    ) : (
                      <TableCell
                        key={`vsi-${user.id}-${column.startTime}`}
                        className={classes.tableCellDisabled}
                      />
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
        </Paper>
      </div>
    );
  }
}

ViewSchedule.propTypes = {
  history: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
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
)(ViewSchedule);
