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

import DisplayRequests from '../../components/DisplayRequests';
import CURRENT_USER_QUERY from '../../graphql/current-user.query';


import styles from './Dashboard.styles';

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
          {/* TODO: update link to go edit profile page */}
          You have no capabilities assigned for your user profile. <Link to="/groups">Click here to add capabilities</Link>
        </Typography>
      </Paper>
      <DisplayRequests classes={classes} user={user} />
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

export default compose(connect(mapStateToProps), withStyles(styles), userQuery)(Dashboard);
