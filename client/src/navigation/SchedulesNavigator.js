import { StackNavigator } from 'react-navigation';

import { Root, Detail, Requests } from '../screens/schedules';
import NavOptions from '../config/NavOptions';

const SchedulesNavigator = StackNavigator(
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

export default SchedulesNavigator;
