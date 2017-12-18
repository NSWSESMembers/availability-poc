import PropTypes from 'prop-types';
import React from 'react';
import {
  addNavigationHelpers,
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { connect } from 'react-redux';
import { REHYDRATE } from 'redux-persist';

import StackAuth from './screens/auth/StackAuth';

import Home from './screens/home.screen';
import Groups from './screens/groups.screen';
import Group from './screens/group.screen';
import Events from './screens/events.screen';
import Schedules from './screens/schedules.screen';
import Signin from './screens/signin.screen';
import Settings from './screens/settings.screen';
import NewGroup from './screens/new-group.screen';
import SearchGroup from './screens/search-groups.screen';
import EventDetail from './screens/event-detail.screen';

const tabBarConfiguration = {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    labelStyle: {
      fontSize: 8,
    },
    style: {
      backgroundColor: 'white',
    },
    activeTintColor: 'teal',
    inactiveTintColor: 'black',
    showIcon: true,
    showLabel: true,
  },
};

// tabs in main screen
const MainScreenNavigator = TabNavigator(
  {
    Home: { screen: Home },
    Groups: { screen: Groups },
    Schedules: { screen: Schedules },
    Events: { screen: Events },
    Settings: { screen: Settings },
  },
  tabBarConfiguration,
);

const AppNavigator = StackNavigator(
  {
    Main: { screen: MainScreenNavigator },
    Signin: { screen: Signin },
    NewGroup: { screen: NewGroup },
    SearchGroup: { screen: SearchGroup },
    Group: { screen: Group },
    Event: { screen: EventDetail },
  },
  {
    mode: 'modal',
  },
);

// reducer initialization code
const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const initialNavState = AppNavigator.router.getStateForAction(tempNavState);

// reducer code
export const navigationReducer = (state = initialNavState, action) => {
  let nextState;
  switch (action.type) {
    case REHYDRATE:
      // convert persisted data to Immutable and confirm rehydration
      if (!action.payload || !action.payload.auth || !action.payload.auth.token) {
        const { routes, index } = state;
        if (routes[index].routeName !== 'Signin') {
          nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({ routeName: 'Signin' }),
            state,
          );
        }
      }
      break;
    case 'LOGOUT': {
      const { routes, index } = state;
      if (routes[index].routeName !== 'Signin') {
        nextState = AppNavigator.router.getStateForAction(
          NavigationActions.navigate({ routeName: 'Signin' }),
          state,
        );
      }
      break;
    }
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

const AppWithNavigationState = (props) => {
  const { dispatch, nav } = props;

  console.log(nav);

  if (!props.auth.username) {
    return <StackAuth />;
  }

  return <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />;
};

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.shape().isRequired,
  auth: PropTypes.shape().isRequired,
};

const mapStateToProps = ({ auth, nav }) => ({
  auth,
  nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
