import React from 'react';
import { StatusBar, View } from 'react-native';
import { SwitchNavigator } from 'react-navigation';

import ModalNavigator from './ModalNavigator';
import AuthStackNavigator from './AuthNavigator';
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
    ModalNavigator: {
      screen: ModalNavigator,
    },
    Auth: {
      screen: AuthStackNavigator,
    },
  },
  {
    // the root stack shows no UI
    headerMode: 'none',
    initialRouteName: 'Loading',
  },
);

const RootNavigatorWithStatusBar = () => (
  <View style={{ flex: 1 }}>
    <StatusBar
      barStyle="light-content"
    />
    <RootNavigator />
  </View>
);

export default RootNavigatorWithStatusBar;
