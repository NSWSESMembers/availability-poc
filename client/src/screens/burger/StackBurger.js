import { StackNavigator } from 'react-navigation';

import Burger from './Index';
import Profile from './Profile';

import NavOptions from '../../config/NavOptions';

const StackBurger = StackNavigator(
  {
    Groups: {
      screen: Burger,
    },
    Profile: {
      screen: Profile,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default StackBurger;
