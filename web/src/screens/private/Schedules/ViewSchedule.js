import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';

import { NavLink } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';

import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import { CircularProgress } from 'material-ui/Progress';
import Table, { TableHead, TableBody, TableCell, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';

import Paper from 'material-ui/Paper';

import ViewScheduleItem from './ViewScheduleItem';

import SCHEDULE_QUERY from '../../../graphql/schedule.query';

import styles from './ViewSchedule.styles';

const ViewSchedule = ({ classes, loading, schedule }) => {
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
      label: begin.format('MMM D'),
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
        <Typography variant="title" color="inherit" className={classes.paperTitle} />
      </div>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {columnData.map(column => <TableCell key={column.id}>{column.label}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {schedule.group.users.map(user => (
            <TableRow key={user.id}>
              {columnData.map(
                column =>
                  (column.id === 'name' ? (
                    <TableCell key={user.id}>{user.displayName}</TableCell>
                  ) : (
                    <ViewScheduleItem
                      key={user.id + column.startTime}
                      userId={user.id}
                      startTime={column.startTime}
                      endTime={column.endTime}
                      timeSegments={schedule.timeSegments.filter(
                        timeSegment => timeSegment.user.id === user.id,
                      )}
                    />
                  )),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

ViewSchedule.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
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
    fetchPolicy: 'network-only',
  }),
  props: ({ data: { loading, schedule } }) => ({
    schedule,
    loading,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), withStyles(styles), scheduleQuery)(ViewSchedule);
