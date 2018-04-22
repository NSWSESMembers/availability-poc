import { StackNavigator } from 'react-navigation';

import { Root, Detail, EditResponse, EventUsers } from '../screens/events';
import NavOptions from '../config/NavOptions';

const EventsNavigator = StackNavigator(
  {
    EventRoot: {
      screen: Root,
    },
    EventDetail: {
      screen: Detail,
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

export default EventsNavigator;
