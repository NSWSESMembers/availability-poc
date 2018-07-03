import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from '../../../styles/AppStyle';

import CURRENT_ORG_QUERY from '../../../graphql/current-org.query';

const ViewUser = ({ classes, loading }) => {
  if (loading) {
    return <CircularProgress className={classes.progress} size={50} />;
  }

  return <div>User</div>;
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
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  orgQuery,
)(ViewUser);
