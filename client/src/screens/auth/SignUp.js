import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';

import { setCurrentUser } from '../../state/auth.actions';

import { Container, Holder } from '../../components/Container';
import { Header } from '../../components/Header';
import { Input } from '../../components/TextInput';
import { NavBar } from '../../components/NavBar';
import { NextButton } from '../../components/Button';
import { Alert } from '../../components/Alert';

import SIGNUP_MUTATION from '../../graphql/signup.mutation';

class SignUp extends Component {
  state = {
    username: '',
    password: '',
    email: '',
    usernameValid: false,
    passwordValid: false,
    emailValid: false,
  }

  onPressSignUp = () => {
    Keyboard.dismiss();
    const { deviceUuid } = this.props.local;
    const { username, password, email } = this.state;
    this.props
      .signup({ username, email, password, deviceUuid })
      .then(({ data: { signup: user } }) => {
        const ourUser = {
          username: user.username,
          token: user.authToken,
        };
        this.props.dispatch(setCurrentUser(ourUser));
      })
      .catch((error) => {
        this.setState({
          status: 'Sign Up Error',
          errorMessage: error.message,
        });
        this.popRef.show();
      });
  }

  onChangeEmail = (value) => {
    let emailValid = false;
    if (value.indexOf('@') !== -1) emailValid = true;

    this.setState({
      email: value,
      emailValid,
    });
  };

  onChangePassword = (value) => {
    let passwordValid = false;
    if (value.length > 5) passwordValid = true;

    this.setState({
      password: value,
      passwordValid,
    });
  };

  onChangeUsername = (value) => {
    let usernameValid = false;
    if (value.length > 5) usernameValid = true;

    this.setState({
      username: value,
      usernameValid,
    });
  };

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <Container>
        <NavBar onPressBack={this.onPressBack} />
        <Holder>
          <Header title="Sign Up" />
          <Input
            title="Username"
            onChangeText={this.onChangeUsername}
            valid={this.state.usernameValid}
            type="username"
          />
          <Input
            title="Password"
            onChangeText={this.onChangePassword}
            valid={this.state.passwordValid}
            type="password"
          />
          <Input
            title="Email"
            onChangeText={this.onChangeEmail}
            valid={this.state.emailValid}
            type="email"
          />
        </Holder>
        <NextButton
          onPress={this.onPressSignUp}
          disabled={
            !(this.state.usernameValid && this.state.passwordValid && this.state.emailValid)
          }
        />
        <Alert
          ref={(el) => {
            this.popRef = el;
          }}
          status={this.state.status}
          message={this.state.errorMessage}
        />
      </Container>
    );
  }
}

const mapStateToProps = ({ auth, local }) => ({
  auth,
  local,
});

SignUp.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }),
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

export default compose(signup, connect(mapStateToProps))(SignUp);
