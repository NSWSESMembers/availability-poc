import { StackNavigator } from 'react-navigation';

import Events from './Events';
import Event from './Detail';
import EditResponse from './EditResponse';
import EventUsers from './EventUsers';
import NavOptions from '../../config/NavOptions';

const StackEvents = StackNavigator(
  {
    Index: {
      screen: Events,
    },
    Event: {
      screen: Event,
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

export default StackEvents;
