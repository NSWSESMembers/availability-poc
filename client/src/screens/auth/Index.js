import React, { Component } from 'react';
import { StatusBar, Text } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from '../../components/Button';
import { Center, Container, Footer, Half, Holder } from '../../components/Container';

class Index extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  goToSignIn = () => {
    this.props.navigation.navigate('SignIn');
  };

  goToRegister = () => {
    this.props.navigation.navigate('SignUp');
  };

  render() {
    return (
      <Container isAlt>
        <StatusBar barStyle="light-content" />
        <Center>
          <Icon name="bullhorn" size={90} color="#FFF" />
          <Text style={{ fontSize: 45, color: '#FFF' }}>Callout</Text>
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

Index.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default Index;
