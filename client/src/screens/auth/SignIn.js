import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import PropTypes from 'prop-types';

import { Container } from '../../components/Container';
import { Header } from '../../components/Header';
import { Input } from '../../components/TextInput';

import LOGIN_MUTATION from '../../graphql/login.mutation';

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 50,
  },
  loadingContainer: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  switchAction: {
    paddingHorizontal: 4,
    color: 'blue',
  },
  submit: {
    marginVertical: 6,
  },
});

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false,
    };
    this.onPressLogin = this.onPressLogin.bind(this);
    this.onPressSignUp = this.onPressSignUp.bind(this);
  }

  onPressLogin() {
    const { username, password } = this.state;

    this.setState({
      loading: true,
    });

    const { deviceUuid } = this.props.local;

    this.props
      .login({ username, password, deviceUuid })
      .then(({ data: { login: user } }) => {
        const ourUser = {
          username: user.username,
          token: user.authToken,
        };
        // this.props.dispatch(setCurrentUser(ourUser));
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        /*
        Alert.alert(`${capitalizeFirstLetter(this.state.view)} error`, error.message, [
          { text: 'OK', onPress: () => console.log('OK pressed') }, // eslint-disable-line no-console
          {
            text: 'Forgot password',
            onPress: () => console.log('Forgot Pressed'),
            style: 'cancel',
          }, // eslint-disable-line no-console
        ]);
        */
      });
  }

  onPressSignUp() {
    this.props.navigation.navigate('SignUp');
  }

  render() {
    return (
      <Container>
        <KeyboardAvoidingView behavior="padding">
          <Header title="Login" type="password" />
          <View style={styles.inputContainer}>
            <Input placeholder="Username" onChangeText={username => this.setState({ username })} />
            <Input
              placeholder="Password"
              onChangeText={password => this.setState({ password })}
              type="password"
            />
          </View>
          <Button style={styles.submit} title="Login" onPress={this.onPressLogin} />
          <View style={styles.switchContainer}>
            <Text>New to Availability?</Text>
            <TouchableOpacity onPress={this.onPressSignUp}>
              <Text style={styles.switchAction}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  dispatch: PropTypes.func.isRequired,
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
