import { StackNavigator } from 'react-navigation';

import Index from './Index';
import SignIn from './SignIn';
import SignUp from './SignUp';

import NavOptions from '../../config/NavOptions';

const StackAuth = StackNavigator(
  {
    Index: {
      screen: Index,
    },
    SignIn: {
      screen: SignIn,
    },
    SignUp: {
      screen: SignUp,
    },
  },
  {
    initialRouteName: 'Index',
    navigationOptions: NavOptions,
    mode: 'modal',
  },
);

export default StackAuth;
