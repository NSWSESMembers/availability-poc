import { StackNavigator } from 'react-navigation';

import { Root, Detail } from '../screens/schedules';
import NavOptions from '../config/NavOptions';

const SchedulesNavigator = StackNavigator(
  {
    SchedulesRoot: {
      screen: Root,
    },
    SchedulesDetail: {
      screen: Detail,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default SchedulesNavigator;
