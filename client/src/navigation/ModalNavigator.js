import { StackNavigator } from 'react-navigation';

import MainNavigator from './MainNavigator';
import { NewResponse as EventNewResponse } from '../screens/events';

// this navigator hangs off the root SwitchNavigator and normally displays the
// MainNavigator (TabNavigator). We use it to pop-up important fullscreen modals

const ModalNavigator = StackNavigator(
  {
    Main: {
      screen: MainNavigator,
    },
    EventNewResponse: {
      screen: EventNewResponse,
    },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    initialRouteName: 'Main',
  },
);

export default ModalNavigator;
