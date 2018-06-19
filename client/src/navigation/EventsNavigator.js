import { StackNavigator } from 'react-navigation';

import { Root, Detail, EditResponse, EventResponses } from '../screens/events';
import { Messages } from '../screens/messages';
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
    EventMessages: {
      screen: Messages,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default EventsNavigator;
