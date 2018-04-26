import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import { setCurrentUser } from '../../state/auth.actions';
import SignIn from './components/SignIn';

import LOGIN_MUTATION from '../../graphql/login.mutation';

class SignInScreen extends Component {
  static navigationOptions = () => ({
    title: 'Sign In',
  });

  state = {
    loading: false,
  }

  handleSignIn = ({ username, password }) => {
    const { deviceUuid } = this.props.local;

    this.setState({ loading: true });

    this.props
      .login({ username, password, deviceUuid })
      .then(({ data: { login: user } }) => {
        const ourUser = {
          id: user.id,
          username: user.username,
          token: user.authToken,
        };
        this.setState({ loading: false });
        this.props.dispatch(setCurrentUser(ourUser));
        // we don't need to navigate here because as soon as the auth props are changed
        // <AuthNavigator /> will navigate for us
      })
      .catch((error) => {
        this.setState({ loading: false });
        Alert.alert('Sign in failed', error.message);
      });
  };

  render() {
    return (
      <SignIn
        loading={this.state.loading}
        onSignIn={this.handleSignIn}
      />
    );
  }
}

SignInScreen.propTypes = {
  local: PropTypes.shape({
    deviceUuid: PropTypes.string,
  }),
  login: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const login = graphql(LOGIN_MUTATION, {
  props: ({ mutate }) => ({
    login: ({ username, password, deviceUuid }) =>
      mutate({
        variables: { user: { username, password, deviceUuid } },
      }),
  }),
});

const mapStateToProps = ({ auth, local }) => ({
  auth,
  local,
});

export default compose(login, connect(mapStateToProps))(SignInScreen);
