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

import { openTimeSegmentModal } from '../../../actions/schedule';

import DayWeek from './components/DayWeek';
import ScheduleHeader from './components/ScheduleHeader';
import TableNextPrevious from '../../../components/Tables/TableNextPrevious';
import SpreadPanel from '../../../components/Panels/SpreadPanel';
import ScheduleDay from './components/ScheduleDay';
import TimeSegmentModal from './components/TimeSegmentModal';

import SCHEDULE_QUERY from '../../../graphql/schedule.query';

const ViewScheduleDay = ({ classes, dispatch, history, loading, match, schedule }) => {
  const onEdit = (e, user, timeSegment, time) => {
    const day = parseInt(match.params.time, 10);

    if (timeSegment === undefined) {
      const newSegment = {
        id: 0,
        startTime: time,
        endTime: moment
          .unix(time)
          .add(1, 'hours')
          .unix(),
      };
      dispatch(openTimeSegmentModal(schedule.id, day, 'Available', user, newSegment));
    } else {
      dispatch(openTimeSegmentModal(schedule.id, day, timeSegment.status, user, timeSegment));
    }
  };

  const onNextDateRange = () => {
    const currentDay = moment.unix(parseInt(match.params.time, 10));
    currentDay.add(1, 'days');
    history.push(`/schedules/${match.params.id}/${currentDay.unix()}`);
  };

  const onPreviousDateRange = () => {
    const currentDay = moment.unix(parseInt(match.params.time, 10));
    currentDay.add(-1, 'days');
    history.push(`/schedules/${match.params.id}/${currentDay.unix()}`);
  };

  const onWeek = () => {
    history.push(`/schedules/${schedule.id.toString()}`);
  };

  if (loading) {
    return <CircularProgress className={classes.progress} size={50} />;
  }

  const day = parseInt(match.params.time, 10);

  const users = schedule.group.users.map(u => ({
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
          <DayWeek dayDisabled weekDisabled={false} onWeek={onWeek} />
          <TableNextPrevious
            hasNext={scheduleEnd > day}
            hasPrevious={scheduleStart < day}
            pressNext={onNextDateRange}
            pressPrevious={onPreviousDateRange}
          />
        </SpreadPanel>
      </Paper>
      <Paper className={classes.paperMargin}>
        <ScheduleDay users={users} day={day} onEdit={onEdit} />
      </Paper>
      <TimeSegmentModal />
    </div>
  );
};

ViewScheduleDay.propTypes = {
  dispatch: PropTypes.func.isRequired,
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
};

const scheduleQuery = graphql(SCHEDULE_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ownProps => ({
    variables: { id: ownProps.match.params.id },
  }),
  props: ({ data: { loading, schedule } }) => ({
    schedule,
    loading,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  scheduleQuery,
)(ViewScheduleDay);
