import { StackNavigator } from 'react-navigation';

import Burger from './Index';
import Profile from './Profile';
import EventResponse from './event-response.screen';

import NavOptions from '../../config/NavOptions';

const StackGroups = StackNavigator(
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

export default StackGroups;
