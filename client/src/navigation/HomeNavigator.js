import { StackNavigator } from 'react-navigation';

import { Root } from '../screens/home';
import NavOptions from '../config/NavOptions';
import { Detail as EventDetail, EditResponse, EventResponses } from '../screens/events';
import { Messages } from '../screens/messages';
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
    EventResponses: {
      screen: EventResponses,
    },
    EventMessages: {
      screen: Messages,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default HomeNavigator;
