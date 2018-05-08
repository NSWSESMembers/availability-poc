import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getCodePushHash } from '../../utils';
import DeviceInfo from '../../selectors/deviceInfo';
import Home from './components/Home';

class HomeScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  state = {
    codePushHash: '-',
    version: 'N/A',
  }

  componentWillMount() {
    getCodePushHash().then((value) => {
      this.setState({
        codePushHash: value,
      });
    });
    this.setState({
      version: DeviceInfo.getVersionString(),
    });
  }

  goToSignIn = () => {
    this.props.navigation.navigate('SignIn');
  };

  goToRegister = () => {
    this.props.navigation.navigate('SignUp');
  };

  render() {
    const { version, codePushHash } = this.state;
    return (
      <Home
        version={version}
        codePushHash={codePushHash}
        onPressSignIn={this.goToSignIn}
        onPressRegister={this.goToRegister}
      />
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default HomeScreen;
