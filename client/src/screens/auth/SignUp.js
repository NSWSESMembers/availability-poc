import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';

import { Container, Holder } from '../../components/Container';
import { Header } from '../../components/Header';
import { Input } from '../../components/TextInput';
import { NavBar } from '../../components/NavBar';
import { NextButton } from '../../components/Button';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      usernameValid: false,
      passwordValid: false,
      emailValid: false,
      loading: false,
    };
    this.onPressSignUp = this.onPressSignUp.bind(this);
  }

  onPressSignUp() {}

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

  render() {
    return (
      <Container>
        <NavBar onPressBack={() => this.props.navigation.goBack()} />
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
        <NextButton onPress={this.onPressSignUp} disabled={this.state.loading} />
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
};

export default compose(connect(mapStateToProps))(SignUp);
