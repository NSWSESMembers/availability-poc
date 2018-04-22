import { StackNavigator } from 'react-navigation';

import { Root, Detail, EditResponse, EventResponses } from '../screens/events';
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
    EventResponses: {
      screen: EventResponses,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default EventsNavigator;
