import { StackNavigator } from 'react-navigation';

import SignIn from './SignIn';
import SignUp from './SignUp';

const options = {
  header: null,
};

const StackAuth = StackNavigator(
  {
    SignIn: {
      screen: SignIn,
    },
    SignUp: {
      screen: SignUp,
    },
  },
  {
    initialRouteName: 'SignIn',
    navigationOptions: options,
  },
);

module.exports = StackAuth;
