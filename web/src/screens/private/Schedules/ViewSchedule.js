import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Table, { TableHead, TableBody, TableCell, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

import { STATUS_AVAILABLE, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../../../config';

import { peopleCount, searchTimeSegments } from '../../../selectors/timeSegments';
import { dateColumns, dateScheduleLabel } from '../../../selectors/dates';

import SCHEDULE_QUERY from '../../../graphql/schedule.query';
import {
  CREATE_TIME_SEGMENT_MUTATION,
  REMOVE_TIME_SEGMENT_MUTATION,
  UPDATE_TIME_SEGMENT_MUTATION,
} from '../../../graphql/time-segment.mutation';

import TimeCountLabel from './TimeCountLabel';
import ViewScheduleItem from './ViewScheduleItem';
import TimeModal from '../../../components/Modals/TimeModal';
import TableNextPrevious from '../../../components/Tables/TableNextPrevious';

import styles from './ViewSchedule.styles';

class ViewSchedule extends React.Component {
  state = {
    startTimeRange: moment().isoWeekday(1).startOf('week').unix(),
    endTimeRange: moment().isoWeekday(1).startOf('week').add(7, 'days')
      .unix(),
    modalOpen: false,
    modalStatus: '',
    modalStartTime: 0,
    modalEndTime: 0,
    modalUser: undefined,
    modalTimeSegmentId: 0,
    modalTimeSegmentStartTime: 0,
    modalTimeSegmentEndTime: 0,
  };

  onOpenModal = (e, modalUser, modalStatus, modalStartTime, modalEndTime) => {
    // find existing segments
    const modalTimeSegments = searchTimeSegments(this.props.schedule.timeSegments, {
      status: modalStatus,
      startTime: modalStartTime,
      endTime: modalEndTime,
      userId: modalUser.id,
    });

    let modalTimeSegmentId = 0;
    let modalTimeSegmentStartTime = 0;
    let modalTimeSegmentEndTime = 0;

    if (modalTimeSegments.length > 0) {
      modalTimeSegmentId = modalTimeSegments[0].id;
      modalTimeSegmentStartTime = modalTimeSegments[0].startTime;
      modalTimeSegmentEndTime = modalTimeSegments[0].endTime;
    }

    this.setState({
      modalOpen: true,
      modalUser,
      modalStatus,
      modalStartTime,
      modalEndTime,
      modalTimeSegmentId,
      modalTimeSegmentStartTime,
      modalTimeSegmentEndTime,
    });
  };
  onCancelModal = () => {
    this.setState({ modalOpen: false });
  };
  onSaveModal = (startTime, endTime, userId, timeSegmentId) => {
    if (timeSegmentId > 0) {
      this.props.updateTimeSegment({
        scheduleId: parseInt(this.props.match.params.id, 10),
        segmentId: timeSegmentId,
        status: this.state.modalStatus,
        startTime: moment(startTime).unix(),
        endTime: moment(endTime).unix(),
      });
    } else {
      this.props.createTimeSegment({
        userId,
        scheduleId: parseInt(this.props.match.params.id, 10),
        status: this.state.modalStatus,
        startTime: moment(startTime).unix(),
        endTime: moment(endTime).unix(),
      });
    }

    this.setState({ modalOpen: false });
  };
  onDeleteModal = (timeSegmentId) => {
    if (timeSegmentId > 0) {
      this.props.removeTimeSegment({
        scheduleId: parseInt(this.props.match.params.id, 10),
        segmentId: timeSegmentId,
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

    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="title" className={classes.paperTitle} gutterBottom>
              {schedule.name} - ({dateScheduleLabel(schedule.startTime, schedule.endTime)})
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>{schedule.details}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Paper className={classes.rootPaper}>
          <TableNextPrevious
            hasNext={schedule.endTime > this.state.endTimeRange}
            hasPrevious={schedule.startTime < this.state.startTimeRange}
            pressNext={this.onNextDateRange}
            pressPrevious={this.onPreviousDateRange}
          />
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
                    column.startTime < schedule.startTime ||
                    column.startTime > schedule.endTime
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
                    return column.startTime >= schedule.startTime &&
                      column.startTime <= schedule.endTime ? (
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
                    return column.startTime >= schedule.startTime &&
                      column.startTime <= schedule.endTime ? (
                        <ViewScheduleItem
                          key={`vsi-${user.id}-${column.startTime}`}
                          user={user}
                          startTime={column.startTime}
                          endTime={column.endTime}
                          onOpenModal={this.onOpenModal}
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
          <TimeModal
            onCancel={this.onCancelModal}
            onSave={this.onSaveModal}
            onDelete={this.onDeleteModal}
            open={this.state.modalOpen}
            status={this.state.modalStatus}
            startTime={this.state.modalStartTime}
            endTime={this.state.modalEndTime}
            user={this.state.modalUser}
            timeSegmentId={this.state.modalTimeSegmentId}
            timeSegmentStartTime={this.state.modalTimeSegmentStartTime}
            timeSegmentEndTime={this.state.modalTimeSegmentEndTime}
          />
        </Paper>
      </div>
    );
  }
}

ViewSchedule.propTypes = {
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
