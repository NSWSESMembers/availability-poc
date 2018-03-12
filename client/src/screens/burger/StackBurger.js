import { StackNavigator } from 'react-navigation';

import Burger from './Index';
import Profile from './Profile';
import EventResponse from '../events/Response';

import NavOptions from '../../config/NavOptions';

const StackBurger = StackNavigator(
  {
    Groups: {
      screen: Burger,
    },
    Profile: {
      screen: Profile,
    },
    EventResponse: {
      screen: EventResponse,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default StackBurger;
