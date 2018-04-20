import { SwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainNavigator';
import AuthStackNavigator from './AuthNavigator';
import EditResponse from '../screens/events/EditResponse';
import LoadingScreen from '../screens/auth/Loading';

// the root stack shows no UI - it exists just so we can pop-up modals over 'Main' at the
// appropriate times. Main is shown always, otherwise.
// Auth: whenever the user is not logged in or a GraphQL request returns unauthorized
// Event: whenever the user needs to be prompted to respond to an event
const RootNavigator = SwitchNavigator(
  {
    Loading: {
      screen: LoadingScreen,
    },
    Main: {
      screen: MainTabNavigator,
    },
    Auth: {
      screen: AuthStackNavigator,
    },
    Event: {
      screen: EditResponse,
    },
  },
  {
    // the root stack shows no UI
    headerMode: 'none',
    initialRouteName: 'Loading',
  },
);

export default RootNavigator;
