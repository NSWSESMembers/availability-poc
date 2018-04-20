import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from '../../components/Button';
import { codePushHash } from '../../utils';
import { Center, Container, Footer, Half, Holder } from '../../components/Container';

class Home extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      codePushHash: '-',
    };
  }

  componentWillMount() {
    codePushHash().then((value) => {
      this.setState({
        codePushHash: value,
      });
    });
  }

  goToSignIn = () => {
    this.props.navigation.navigate('SignIn');
  };

  goToRegister = () => {
    this.props.navigation.navigate('SignUp');
  };

  render() {
    return (
      <Container isAlt>
        <Center>
          <Icon name="bullhorn" size={90} color="#FFF" />
          <Text style={{ fontSize: 45, color: '#FFF' }}>Callout</Text>
          <Text style={{ fontSize: 15, color: '#FFF' }}>
          Version {DeviceInfo.typeof === undefined ? DeviceInfo.getReadableVersion() : 'NA'} Revision {this.state.codePushHash}
          </Text>
        </Center>
        <Footer>
          <Half>
            <Holder>
              <Button text="Sign In" onPress={this.goToSignIn} />
            </Holder>
          </Half>
          <Half>
            <Holder>
              <Button text="Register" onPress={this.goToRegister} type="secondary" />
            </Holder>
          </Half>
        </Footer>
      </Container>
    );
  }
}

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default Home;
