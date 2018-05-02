import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import Table, { TableBody, TableCell, TableRow, TableHead } from 'material-ui/Table';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

import styles from './Dashboard.styles';


const displayRequests = (classes, user) => {
  if (!user.groups.length) {
    return (
      <Paper className={classes.paper}>
        <Typography component="p" align="center">
          You are currently not assigned to any groups. <Link to="/groups">Click here to join groups</Link>
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <Toolbar className={classes.tableToolbar}>
        <Typography variant="title">Requests</Typography>
      </Toolbar>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Group</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {user.schedules.map(schedule => (
            <TableRow key={schedule.id}>
              <TableCell>
                <Link to={`/schedules/${schedule.id}`}>{schedule.name}</Link>
              </TableCell>
              <TableCell>{schedule.group.name}</TableCell>
              {/* TODO: Make sure schedule object has this in the future */}
              {/* <TableCell>{schedule.type}</TableCell> */}
              <TableCell>
                {schedule.startTime === 0 ? '-' : moment.unix(schedule.startTime).format('LLL')}
              </TableCell>
              <TableCell>
                {schedule.endTime === 2147483647
                  ? '-'
                  : moment.unix(schedule.endTime).format('LLL')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

const Dashboard = ({ classes, loading, user }) => {
  if (loading) {
    return <CircularProgress className={classes.progress} size={50} />;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={4}>
        <Typography variant="headline" component="h3" align="center">
          Welcome to Callout
        </Typography>
        <Typography component="p" align="center">
          An open source availability and event response management system.
        </Typography>
      </Paper>
      {/* TODO: Hide this when user has added their capabilities */}
      <Paper className={classes.paper}>
        <Typography component="p" align="center">
          {/* TODO: update link t go edit profile page */}
          You have no capabilities assigned for your user profile. <Link to="/groups">Click here to add capabilities</Link>
        </Typography>
      </Paper>
      {displayRequests(classes, user)}
    </div>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
    schedules: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        // TODO: make sure this is returned in the future
        // type: PropTypes.string.isRequired,
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
      }),
    ),
  }),
};

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, user, networkStatus, refetch } }) => ({
    loading,
    user,
    networkStatus,
    refetch,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), withStyles(styles), userQuery)(Dashboard);
