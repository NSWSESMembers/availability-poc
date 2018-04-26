import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import Profile from './components/Profile';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';
import UPDATE_USERPROFILE_MUTATION from '../../graphql/update-userprofile.mutation';

class ProfileScreen extends Component {
  static navigationOptions = {
    title: 'My Profile',
  };

  handleNameChange = (newName) => {
    this.props.updateUserProfile({ displayName: newName });
  }

  render() {
    const { loading, user } = this.props;
    return (
      <Profile
        loading={loading}
        user={user}
        onChangeName={this.handleNameChange}
      />
    );
  }
}

ProfileScreen.propTypes = {
  loading: PropTypes.bool,
  updateUserProfile: PropTypes.func,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }),
};

const updateUserProfileMutation = graphql(UPDATE_USERPROFILE_MUTATION, {
  props: ({ mutate }) => ({
    updateUserProfile: ({ displayName }) =>
      mutate({
        variables: { user: { displayName } },
      }),
  }),
});

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ({ auth }) => ({ variables: { id: auth.id }, fetchPolicy: 'cache-only' }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  userQuery,
  updateUserProfileMutation,
)(ProfileScreen);
