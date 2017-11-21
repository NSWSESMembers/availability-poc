import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import {
  setCurrentUser,
} from '../state/auth.actions';
import LOGIN_MUTATION from '../graphql/login.mutation';
import SIGNUP_MUTATION from '../graphql/signup.mutation';
import { capitalizeFirstLetter } from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#eeeeee',
    paddingHorizontal: 50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderRadius: 4,
    marginVertical: 6,
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headingContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 42,
    fontWeight: '100',
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

class Signin extends Component {
  static navigationOptions = {
    title: 'Availability',
    headerLeft: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      view: 'login',
    };
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.switchView = this.switchView.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.token) {
      nextProps.navigation.goBack();
    }
  }

  login() {
    const { username, password } = this.state;

    this.setState({
      loading: true,
    });

    const deviceId = this.props.local.deviceId;
    console.log(`Logging in with device ID: ${deviceId}`);

    this.props.login({ username, password, deviceId })
      .then(({ data: { login: user } }) => {
        const ourUser = {
          username: user.username,
          token: user.authToken,
        }
        this.props.dispatch(setCurrentUser(ourUser));
        this.setState({
          loading: false,
        });
      }).catch((error) => {
        this.setState({
          loading: false,
        });
        Alert.alert(
          `${capitalizeFirstLetter(this.state.view)} error`,
          error.message,
          [
            { text: 'OK', onPress: () => console.log('OK pressed') }, // eslint-disable-line no-console
            { text: 'Forgot password', onPress: () => console.log('Forgot Pressed'), style: 'cancel' }, // eslint-disable-line no-console
          ],
        );
      });
  }

  signup() {
    this.setState({
      loading: true,
    });
    const deviceUuid = this.props.local.deviceId;
    const { username, password, email } = this.state;
    this.props.signup({ username, email, password, deviceUuid })
      .then(({ data: { signup: user } }) => {
        const ourUser = {
          username: user.username,
          token: user.authToken,
        }
        this.props.dispatch(setCurrentUser(ourUser));
        this.setState({
          loading: false,
        });
      }).catch((error) => {
        this.setState({
          loading: false,
        });
        Alert.alert(
          `${capitalizeFirstLetter(this.state.view)} error`,
          error.message,
          [{ text: 'OK', onPress: () => console.log('OK pressed') }],  // eslint-disable-line no-console
        );
      });
  }

  switchView() {
    this.setState({
      view: this.state.view === 'signup' ? 'login' : 'signup',
    });
  }

  render() {
    const { view } = this.state;

    return (
      <KeyboardAvoidingView
        behavior={'padding'}
        style={styles.container}
      >
        {this.state.loading ?
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View> : undefined}
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>
            {view === 'signup' ? 'Sign up' : 'Login'}
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={username => this.setState({ username })}
            placeholder={'Username'}
            autoCapitalize={'none'}
            autoCorrect={false}
            style={styles.input}
          />
          {view === 'signup' ?
            <TextInput
              onChangeText={email => this.setState({ email })}
              placeholder={'Email'}
              autoCapitalize={'none'}
              autoCorrect={false}
              style={styles.input}
            /> : undefined}
          <TextInput
            onChangeText={password => this.setState({ password })}
            placeholder={'Password'}
            secureTextEntry
            style={styles.input}
          />
        </View>
        <Button
          onPress={this[view]}
          style={styles.submit}
          title={view === 'signup' ? 'Sign up' : 'Login'}
          disabled={this.state.loading || !!this.props.auth.token}
        />
        <View style={styles.switchContainer}>
          <Text>
            { view === 'signup' ?
              'Already have an account?' : 'New to Availability?' }
          </Text>
          <TouchableOpacity
            onPress={this.switchView}
          >
            <Text style={styles.switchAction}>
              {view === 'login' ? 'Sign up' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
Signin.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }),
  auth: PropTypes.shape({
    loading: PropTypes.bool,
    token: PropTypes.string,
  }),
  dispatch: PropTypes.func.isRequired,
};

const login = graphql(LOGIN_MUTATION, {
  props: ({ mutate }) => ({
    login: ({ username, password, deviceId }) =>
      mutate({
        variables: { user: { username, password, deviceUuid:deviceId } },
      }),
  }),
});

const signup = graphql(SIGNUP_MUTATION, {
  props: ({ mutate }) => ({
    signup: ({ username, email, password, deviceUuid }) =>
      mutate({
        variables: { user: { username, email, password, deviceUuid } },
      }),
  }),
});

const mapStateToProps = ({ auth, local }) => ({
  auth, local
});

export default compose(
  login,
  signup,
  connect(mapStateToProps),
)(Signin);
