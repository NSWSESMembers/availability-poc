import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';

import { Link, NavLink } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';

import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import { CircularProgress } from 'material-ui/Progress';
import TextField from 'material-ui/TextField';
import Table, { TableHead, TableBody, TableCell, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';

import Paper from 'material-ui/Paper';

import { STATUS_AVAILABLE, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../../../config';

import TimeCountLabel from './TimeCountLabel';
import ViewScheduleItem from './ViewScheduleItem';

import { peopleCount } from '../../../selectors/timeSegments';

import SCHEDULE_QUERY from '../../../graphql/schedule.query';
import {
  CREATE_TIME_SEGMENT_MUTATION,
  REMOVE_TIME_SEGMENT_MUTATION,
  UPDATE_TIME_SEGMENT_MUTATION,
} from '../../../graphql/time-segment.mutation';

import TimeModal from '../../../components/Modals/TimeModal';

import styles from './ViewSchedule.styles';

class ViewSchedule extends React.Component {
  state = {
    modalOpen: false,
    modalStatus: '',
    modalStartTime: 0,
    modalEndTime: 0,
    modalUser: undefined,
  };

  onOpenModal = (e, modalUser, modalStatus, modalStartTime, modalEndTime) => {
    this.setState({ modalOpen: true, modalUser, modalStatus, modalStartTime, modalEndTime });
  };
  onCancelModal = () => {
    this.setState({ modalOpen: false });
  };
  onSaveModal = (newStartTime, newEndTime) => {
    const startTime = moment(newStartTime).unix();
    const endTime = moment(newEndTime).unix();

    console.log(startTime, 'next', endTime);
    this.props.createTimeSegment({
      scheduleId: parseInt(this.props.match.params.id, 10),
      status: this.state.modalStatus,
      startTime,
      endTime,
    });
    this.setState({ modalOpen: false });
  };
  render() {
    const { classes, loading, schedule } = this.props;

    if (loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const columnData = [{ id: 'name', label: 'Name' }];

    const begin = moment()
      .isoWeekday(1)
      .startOf('week');

    const end = moment()
      .isoWeekday(1)
      .startOf('week')
      .add(7, 'days');

    const diff = end.diff(begin, 'days');

    for (let i = 1; i <= diff; i += 1) {
      begin.add(1, 'days');
      columnData.push({
        id: i,
        label: begin.format('ddd, MMM D'),
        startTime: begin.unix(),
        endTime: begin
          .clone()
          .add(1, 'days')
          .add(-1, 'seconds')
          .unix(),
      });
    }

    return (
      <Paper className={classes.root}>
        <div className={classes.toolbar}>
          <NavLink to="/dashboard">
            <ArrowBackIcon />
          </NavLink>
          <Typography variant="title" color="inherit" className={classes.paperTitle}>
            {schedule.name} - ({schedule.group.name})
          </Typography>
        </div>
        <Typography gutterBottom noWrap>
          <br />
          {`
            Lorem ipsum dolor sit amet, consectetur adipisicing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          `}
        </Typography>
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
                column =>
                  (column.id === 'name' ? (
                    <TableCell key={column.id} className={classes.tableCellHeaderFirst}>
                      {column.label}
                    </TableCell>
                  ) : (
                    <TableCell key={column.id} className={classes.tableCellHeader} style={{ paddingRight: 0 }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Link to="/dashboard">{column.label}</Link>
                      </div>
                    </TableCell>
                  )),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.group.users.map(user => (
              <TableRow key={user.id}>
                {columnData.map(
                  column =>
                    (column.id === 'name' ? (
                      <TableCell key={user.id} className={classes.tableCellFirst}>
                        <Link to="/dashboard">{user.displayName}</Link>
                      </TableCell>
                    ) : (
                      <ViewScheduleItem
                        key={`vsi-${user.id}-${column.startTime}`}
                        user={user}
                        startTime={column.startTime}
                        endTime={column.endTime}
                        onOpenModal={this.onOpenModal}
                        timeSegments={schedule.timeSegments}
                      />
                    )),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TimeModal
          onCancel={this.onCancelModal}
          onSave={this.onSaveModal}
          open={this.state.modalOpen}
          status={this.state.modalStatus}
          startTime={this.state.modalStartTime}
          endTime={this.state.modalEndTime}
          user={this.state.modalUser}
        />
      </Paper>
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
    createTimeSegment: ({ scheduleId, status, startTime, endTime }) =>
      mutate({
        variables: { timeSegment: { scheduleId, status, startTime, endTime } },
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
    removeTimeSegment: ({ segmentId }) =>
      mutate({
        variables: { timeSegment: { segmentId } },
        refetchQueries: [
          {
            query: SCHEDULE_QUERY,
          },
        ],
      }),
  }),
});

const updateTimeSegment = graphql(UPDATE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    updateTimeSegment: ({ segmentId, status, startTime, endTime }) =>
      mutate({
        variables: { timeSegment: { segmentId, status, startTime, endTime } },
        refetchQueries: [
          {
            query: SCHEDULE_QUERY,
          },
        ],
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), withStyles(styles), scheduleQuery,
  createTimeSegment,
  removeTimeSegment,
  updateTimeSegment)(ViewSchedule);
