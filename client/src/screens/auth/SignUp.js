import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import { setCurrentUser } from '../../state/auth.actions';
import SignUp from './components/SignUp';

import SIGNUP_MUTATION from '../../graphql/signup.mutation';

class SignUpScreen extends Component {
  static navigationOptions = () => ({
    title: 'Register',
  });

  state = {
    loading: false,
  };

  handleSignUp = ({ username, email, password }) => {
    const { deviceUuid } = this.props.local;

    this.setState({ loading: true });

    this.props
      .signup({ username, email, password, deviceUuid })
      .then(({ data: { signup: user } }) => {
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
        Alert.alert('Sign up failed', error.message);
      });
  };

  render() {
    return (
      <SignUp
        loading={this.state.loading}
        onSignUp={this.handleSignUp}
      />
    );
  }
}

SignUpScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  local: PropTypes.shape({
    deviceUuid: PropTypes.string,
  }),
  signup: PropTypes.func.isRequired,
};

const signup = graphql(SIGNUP_MUTATION, {
  props: ({ mutate }) => ({
    signup: ({ username, email, password, deviceUuid }) =>
      mutate({
        variables: { user: { username, email, password, deviceUuid } },
      }),
  }),
});

const mapStateToProps = ({ auth, local }) => ({
  auth,
  local,
});

export default compose(signup, connect(mapStateToProps))(SignUpScreen);
