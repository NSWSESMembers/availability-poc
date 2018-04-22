import { StackNavigator } from 'react-navigation';

import { Root } from '../screens/home';
import NavOptions from '../config/NavOptions';
import { Detail as EventDetail, EditResponse, EventUsers } from '../screens/events';
import { Detail as ScheduleDetail } from '../screens/schedules';

const HomeNavigator = StackNavigator(
  {
    Root: {
      screen: Root,
    },
    SchedulesDetail: {
      screen: ScheduleDetail,
    },
    EventDetail: {
      screen: EventDetail,
    },
    EventEditResponse: {
      screen: EditResponse,
    },
    EventUsers: {
      screen: EventUsers,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default HomeNavigator;
