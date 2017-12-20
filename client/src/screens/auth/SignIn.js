import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import PropTypes from 'prop-types';

import { NextButton } from '../../components/Button';
import { Container, Holder } from '../../components/Container';
import { Header } from '../../components/Header';
import { Input } from '../../components/TextInput';
import { NavBar } from '../../components/NavBar';
import { Alert } from '../../components/Alert';

import LOGIN_MUTATION from '../../graphql/login.mutation';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      usernameValid: false,
      passwordValid: false,
    };
    this.popupRef = null;
    this.onPressLogin = this.onPressLogin.bind(this);
  }

  onPressLogin() {
    const { username, password } = this.state;
    const { deviceUuid } = this.props.local;

    this.setState({ loading: true });

    this.props
      .login({ username, password, deviceUuid })
      .then(({ data: { login: user } }) => {
        /*
        const ourUser = {
          username: user.username,
          token: user.authToken,
        };
        this.props.dispatch(setCurrentUser(ourUser));
        */

        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          status: 'Login Error',
          errorMessage: error.message,
        });
        this.popRef.show();
      });
  }

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

  render() {
    return (
      <Container>
        <NavBar
          rightLinkText="Sign Up"
          onPressRightLink={() => this.props.navigation.navigate('SignUp')}
        />
        <Holder>
          <Header title="Login" />
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
        </Holder>
        <NextButton onPress={this.onPressLogin} disabled={this.state.loading} />
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

SignIn.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  local: PropTypes.shape({
    deviceUuid: PropTypes.string,
  }),
  login: PropTypes.func.isRequired,
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

export default compose(login, connect(mapStateToProps))(SignIn);
