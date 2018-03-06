import { StackNavigator } from 'react-navigation';

import Events from './Events';
import Event from './Detail';
import EventResponseEdit from './ResponseEdit';
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
    EventResponseEdit: {
      screen: EventResponseEdit,
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
