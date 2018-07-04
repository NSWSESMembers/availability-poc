import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { SCHEDULE_TYPE_DEPLOYMENT } from '../../../config';
import {
  addDeployPerson,
  removeDeployPerson,
  openTimeSegmentModal,
} from '../../../actions/schedule';

import { dateColumns } from '../../../selectors/dates';

import SCHEDULE_QUERY from '../../../graphql/schedule.query';

import DayWeek from './components/DayWeek';
import DeployToolbar from './components/DeployToolbar';
import ScheduleHeader from './components/ScheduleHeader';
import ScheduleWeekHeader from './components/ScheduleWeekHeader';
import ScheduleWeekItem from './components/ScheduleWeekItem';
import SpreadPanel from '../../../components/Panels/SpreadPanel';
import TableNextPrevious from '../../../components/Tables/TableNextPrevious';
import TimeSegmentModal from './components/TimeSegmentModal';
import UserLink from './components/UserLink';

import styles from '../../../styles/AppStyle';

class ViewSchedule extends React.Component {
  state = {
    startTimeRange: moment()
      .isoWeekday(1)
      .startOf('week')
      .unix(),
    endTimeRange: moment()
      .isoWeekday(1)
      .startOf('week')
      .add(7, 'days')
      .unix(),
  };

  onDay = () => {
    const { history } = this.props;
    history.push(`/schedules/${this.props.match.params.id}/${this.state.startTimeRange}`);
  };

  onEdit = (e, user, timeSegment, day, status) => {
    const { schedule } = this.props;
    this.props.dispatch(openTimeSegmentModal(schedule.id, day, status, user, timeSegment));
  };

  onNextDateRange = () => {
    const nextStartTimeRange = moment
      .unix(this.state.startTimeRange)
      .add(7, 'days')
      .unix();
    const nextEndTimeRange = moment
      .unix(this.state.endTimeRange)
      .add(7, 'days')
      .unix();

    this.setState({
      startTimeRange: nextStartTimeRange,
      endTimeRange: nextEndTimeRange,
    });
  };

  onPreviousDateRange = () => {
    const previousStartTimeRange = moment
      .unix(this.state.startTimeRange)
      .add(-7, 'days')
      .unix();
    const previousEndTimeRange = moment
      .unix(this.state.endTimeRange)
      .add(-7, 'days')
      .unix();

    this.setState({
      startTimeRange: previousStartTimeRange,
      endTimeRange: previousEndTimeRange,
    });
  };

  onSelectPerson = (e, id) => {
    if (e.target.checked) {
      this.props.dispatch(addDeployPerson(id));
    } else {
      this.props.dispatch(removeDeployPerson(id));
    }
  };

  render() {
    const { classes, loading, schedule, deploy } = this.props;

    if (loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }
    const columnData = dateColumns(
      moment.unix(this.state.startTimeRange),
      moment.unix(this.state.endTimeRange),
    );

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
          {schedule.type === SCHEDULE_TYPE_DEPLOYMENT && <DeployToolbar schedule={schedule} />}
          <Table className={classes.table}>
            <ScheduleWeekHeader schedule={schedule} columnData={columnData} />
            <TableBody>
              {schedule.group.users.map((user) => {
                const selected = deploy.peopleSelected.indexOf(user.id) > -1;
                const userSegments = schedule.timeSegments.filter(
                  timeSegment => timeSegment.user.id === user.id,
                );
                return (
                  <TableRow key={user.id} hover>
                    {schedule.type === 'deployment' && (
                      <TableCell className={classes.tableCellCheckbox}>
                        <Checkbox
                          checked={selected}
                          className={classes.tableCheckbox}
                          onChange={e => this.onSelectPerson(e, user.id)}
                        />
                      </TableCell>
                    )}
                    {columnData.map((column) => {
                      if (column.id === 'name') {
                        return (
                          <TableCell key={user.id} className={classes.tableCellFirst}>
                            <UserLink timeSegments={userSegments} user={user} />
                          </TableCell>
                        );
                      }

                      if (column.startTime >= scheduleStart && column.startTime <= scheduleEnd) {
                        return (
                          <ScheduleWeekItem
                            key={`vsi-${user.id}-${column.startTime}`}
                            user={user}
                            startTime={column.startTime}
                            endTime={column.endTime}
                            onOpenModal={this.onEdit}
                            timeSegments={userSegments}
                          />
                        );
                      }

                      return (
                        <TableCell
                          key={`vsi-${user.id}-${column.startTime}`}
                          className={classes.tableCellDisabled}
                        />
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TimeSegmentModal />
        </Paper>
      </div>
    );
  }
}

ViewSchedule.propTypes = {
  dispatch: PropTypes.func,
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
  deploy: PropTypes.shape({
    peopleSelected: PropTypes.arrayOf(PropTypes.number),
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

const mapStateToProps = ({ auth, schedule }) => ({
  auth,
  deploy: schedule.deploy,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  scheduleQuery,
)(ViewSchedule);
