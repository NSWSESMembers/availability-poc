import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';
import { graphql, compose } from 'react-apollo';

import LOGIN_MUTATION from '../../graphql/login.mutation';

import { setCurrentUser } from '../../state/auth.actions';

import { Alert } from '../../components/Alert';
import { Container, Holder } from '../../components/Container';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

class SignIn extends Component {
  static navigationOptions = () => ({
    title: 'Sign In',
  });

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      status: '',
      errorMessage: '',
    };
  }

  onChangePassword = (value) => {
    this.setState({
      password: value,
    });
  };

  onChangeUsername = (value) => {
    this.setState({
      username: value,
    });
  };

  handleSignIn = () => {
    const { username, password } = this.state;
    const { deviceUuid } = this.props.local;

    this.props
      .login({ username, password, deviceUuid })
      .then(({ data: { login: user } }) => {
        const ourUser = {
          id: user.id,
          username: user.username,
          token: user.authToken,
        };
        this.props.dispatch(setCurrentUser(ourUser));
        // we don't need to navigate here because as soon as the auth props are changed
        // <AuthNavigator /> will navigate for us
      })
      .catch((error) => {
        this.setState({
          status: 'Login Error',
          errorMessage: error.message,
        });
        this.popRef.show();
      });
  };

  render() {
    return (
      <Container>
        <Holder margin transparent>
          <Input
            type="username"
            placeholder="Username"
            onChangeText={(value) => {
              this.state.username = value;
            }}
          />
          <Input
            type="password"
            placeholder="Password"
            onChangeText={(value) => {
              this.state.password = value;
            }}
          />
          <Button text="Sign In" onPress={this.handleSignIn} disabled={this.state.authorizing} />
          {this.state.authorizing && (
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

SignIn.propTypes = {
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

export default compose(login, connect(mapStateToProps))(SignIn);
