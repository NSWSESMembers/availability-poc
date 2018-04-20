import { StackNavigator } from 'react-navigation';

import { Events, Detail, EditResponse, EventUsers } from '../screens/events';
import NavOptions from '../config/NavOptions';

const EventNavigator = StackNavigator(
  {
    Root: {
      screen: Events,
    },
    Detail: {
      screen: Detail,
    },
    EditResponse: {
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

export default EventNavigator;
