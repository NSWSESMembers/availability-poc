import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

import styles from '../../../styles/AppStyle';

import CURRENT_ORG_QUERY from '../../../graphql/current-org.query';

import UserHeader from './components/UserHeader';

const ViewUser = ({ classes, loading, match, orgUser }) => {
  if (loading) {
    return <CircularProgress className={classes.progress} size={50} />;
  }

  const id = parseInt(match.params.id, 10);
  const user = orgUser.organisation.users.find(u => u.id === id);

  return (
    <div className={classes.root}>
      <UserHeader user={user} />
      <Paper className={classes.paperMargin}>
        <a href="{user.email}">{user.email}</a>
      </Paper>
    </div>
  );
};

const orgQuery = graphql(CURRENT_ORG_QUERY, {
  options: () => ({
    variables: {
      nameFilter: '',
      typeFilter: '',
    },
  }),
  props: ({ data: { loading, networkStatus, refetch, orgUser } }) => ({
    loading,
    networkStatus,
    refetch,
    orgUser,
  }),
});

ViewUser.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  orgUser: PropTypes.shape({
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        displayName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      }),
    ),
  }),
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  orgQuery,
)(ViewUser);
