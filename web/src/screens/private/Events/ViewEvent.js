import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';

import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import styles from './ViewEvent.styles';

const ViewEvent = ({ classes, loading }) => {
  if (loading) {
    return <CircularProgress className={classes.progress} size={50} />;
  }

  return <div className={classes.root}>View Event</div>;
};

ViewEvent.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
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

export default compose(connect(mapStateToProps), withStyles(styles), userQuery)(ViewEvent);
