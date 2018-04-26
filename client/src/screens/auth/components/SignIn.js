import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';

import { Container, Holder } from '../../../components/Container';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

class SignIn extends Component {
  state = {
    username: '',
    password: '',
  }

  onChangeUsername = (value) => {
    this.setState({
      username: value,
    });
  };

  onChangePassword = (value) => {
    this.setState({
      password: value,
    });
  };

  onSignIn = () => {
    const { username, password } = this.state;
    this.props.onSignIn({ username, password });
  }

  render() {
    const { loading } = this.props;
    const { username, password } = this.state;
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
          <Button text="Sign In" onPress={this.onSignIn} disabled={loading} />
          {loading && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          )}
        </Holder>
      </Container>
    );
  }
}

SignIn.propTypes = {
  onSignIn: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default SignIn;
