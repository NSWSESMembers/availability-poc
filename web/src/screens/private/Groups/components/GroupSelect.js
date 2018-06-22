import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';

import styles from '../../../../styles/AppStyle';

import Tag from '../../../../components/Selects/Tag';

import CURRENT_USER_QUERY from '../../../../graphql/current-user.query';

const GroupSelect = ({ loading, onChange, placeholder, user, value }) => {
  if (loading) {
    return '<span />';
  }
  const groups = user.groups.map(group => ({ value: group.id.toString(), label: group.name }));
  return <Tag list={groups} placeholder={placeholder} onChange={onChange} value={value} />;
};

GroupSelect.propTypes = {
  loading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  user: PropTypes.shape({
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
  value: PropTypes.string,
};

GroupSelect.defaultProps = {
  placeholder: 'Select Group',
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
)(GroupSelect);
