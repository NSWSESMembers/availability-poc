import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Container, Holder } from '../../../components/Container';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Progress } from '../../../components/Progress';

class SignUp extends Component {
  state = {
    username: '',
    password: '',
    email: '',
  };

  onChangeUsername = (value) => {
    this.setState({
      username: value,
    });
  };

  onChangeEmail = (value) => {
    this.setState({
      email: value,
    });
  };

  onChangePassword = (value) => {
    this.setState({
      password: value,
    });
  };

  onSignUp = () => {
    const { username, email, password } = this.state;
    this.props.onSignUp({ username, email, password });
  }

  render() {
    const { loading } = this.props;
    const { username, email, password } = this.state;
    return (
      <Container>
        <Holder margin transparent>
          <Input
            type="username"
            placeholder="Username"
            value={username}
            onChangeText={this.onChangeUsername}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChangeText={this.onChangePassword}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChangeText={this.onChangeEmail}
          />
          <Button text="Register" onPress={this.onSignUp} disabled={loading} />
        </Holder>
        {loading && (
          <Container>
            <Progress />
          </Container>
        )}
      </Container>
    );
  }
}

SignUp.propTypes = {
  onSignUp: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default SignUp;
