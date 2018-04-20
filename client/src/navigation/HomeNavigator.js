import { StackNavigator } from 'react-navigation';

import { Root } from '../screens/home';
import NavOptions from '../config/NavOptions';
import EventDetail from '../screens/events/Detail';
import ScheduleDetail from '../screens/availability/Detail';

const HomeNavigator = StackNavigator(
  {
    Root: {
      screen: Root,
    },
    Event: {
      screen: EventDetail,
    },
    Schedule: {
      screen: ScheduleDetail,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default HomeNavigator;
