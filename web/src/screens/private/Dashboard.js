import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

<<<<<<< HEAD
import styles from '../../styles/AppStyle';
=======
import styles from './Dashboard.styles';
>>>>>>> origin/master
import Message from '../../components/Messages/Message';
import ScheduleTable from './Schedules/components/ScheduleTable';

const Dashboard = ({ classes, loading, user }) => {
  if (loading) {
    return <CircularProgress className={classes.progress} size={50} />;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="headline" component="h3" align="center">
          Welcome to Callout
        </Typography>
        <Typography component="p" align="center">
          An open source availability and event response management system.
        </Typography>
      </Paper>
<<<<<<< HEAD
      <Paper className={classes.paperMargin}>
=======
      <Paper className={classes.paper}>
>>>>>>> origin/master
        <Message>
          You have no capabilities assigned for your user profile.{' '}
          <Link to="/profile">Click here to add capabilities</Link>
        </Message>
      </Paper>
      {user.groups.length === 0 ? (
<<<<<<< HEAD
        <Paper className={classes.paperMargin}>
=======
        <Paper className={classes.paper}>
>>>>>>> origin/master
          <Message>
            You are currently not assigned to any groups.{' '}
            <Link to="/groups">Click here to join groups</Link>
          </Message>
        </Paper>
      ) : (
<<<<<<< HEAD
        <Paper className={classes.paperMargin}>
=======
        <Paper className={classes.paper}>
>>>>>>> origin/master
          <Typography variant="title">Outstanding Requests</Typography>
          <ScheduleTable schedules={user.schedules} />
        </Paper>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.shape({}),
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

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  userQuery,
)(Dashboard);
