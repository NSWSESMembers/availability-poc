import { StackNavigator } from 'react-navigation';

import { Root, Detail, Requests } from '../screens/availability';
import NavOptions from '../config/NavOptions';

const AvailabilityNavigator = StackNavigator(
  {
    Root: {
      screen: Root,
    },
    Detail: {
      screen: Detail,
    },
    Requests: {
      screen: Requests,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default AvailabilityNavigator;
