import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from '../../../components/Button';
import { Center, Container, Footer, Half, Holder } from '../../../components/Container';

const Home = ({ version, codePushHash, onPressSignIn, onPressOAuth, onPressRegister }) => (
  <Container isAlt>
    <Center>
      <Icon name="bullhorn" size={90} color="#FFF" />
      <Text style={{ fontSize: 45, color: '#FFF' }}>Callout</Text>
      <Text style={{ fontSize: 15, color: '#FFF' }}>
      Version {version} Revision {codePushHash}
      </Text>
    </Center>
    <Footer>
      <Half>
        <Holder>
          <Button text="OAuth" onPress={onPressOAuth} />
        </Holder>
      </Half>
      <Half>
        <Holder>
          <Button text="Sign In" onPress={onPressSignIn} />
        </Holder>
      </Half>
      <Half>
        <Holder>
          <Button text="Register" onPress={onPressRegister} type="secondary" />
        </Holder>
      </Half>
    </Footer>
  </Container>
);
Home.propTypes = {
  version: PropTypes.string,
  codePushHash: PropTypes.string,
  onPressSignIn: PropTypes.func,
  onPressOAuth: PropTypes.func,
  onPressRegister: PropTypes.func,
};

export default Home;
