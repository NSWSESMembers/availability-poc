import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StackNavigator } from 'react-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

import { isLoggedIn } from '../selectors/auth';
import { Home, SignIn, SignUp } from '../screens/auth';
import NavOptions from '../config/NavOptions';

const AuthStackNavigator = StackNavigator(
  {
    Home: {
      screen: Home,
    },
    SignIn: {
      screen: SignIn,
    },
    SignUp: {
      screen: SignUp,
    },
  },
  {
    initialRouteName: 'Home',
    navigationOptions: NavOptions,
    mode: 'modal',
  },
);

// this wrapper exists simply to detect when we are logged in and switch to the main app screen
class AuthNavigator extends Component {
  componentDidUpdate() {
    const { auth } = this.props;
    if (isLoggedIn(auth)) {
      console.log('User is logged in - navigating to main');
      this.props.navigation.navigate('ModalNavigator');
    }
  }

  render() {
    return (
      <AuthStackNavigator />
    );
  }
}

AuthNavigator.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  auth: PropTypes.shape().isRequired,
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps))(AuthNavigator);
