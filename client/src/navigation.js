import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { addNavigationHelpers, StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import { REHYDRATE } from 'redux-persist/constants';

import Events from './screens/events.screen';
import Groups from './screens/groups.screen';
import Home from './screens/home.screen';
import NewGroup from './screens/new-group.screen';
import Schedules from './screens/schedules.screen';
import Settings from './screens/settings.screen';
import Signin from './screens/signin.screen';
import WeekAvailability from './screens/week-availability.screen';

const tabBarConfiguration = {
  tabBarOptions: {
    activeTintColor: 'orange',
    inactiveTintColor: 'grey',
  }
}

// tabs in main screen
const MainScreenNavigator = TabNavigator({
  Home: { screen: Home },
  Groups: { screen: Groups },
  Schedules: { screen: Schedules },
  WeekAvailability: { screen: WeekAvailability },
  Events: { screen: Events },
  Settings: { screen: Settings },
}, tabBarConfiguration);

const AppNavigator = StackNavigator({
  Main: { screen: MainScreenNavigator },
  Signin: { screen: Signin },
  NewGroup: { screen: NewGroup },
}, {
  mode: 'modal',
});

// reducer initialization code
const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const initialNavState = AppNavigator.router.getStateForAction(
  tempNavState,
);

// reducer code
export const navigationReducer = (state = initialNavState, action) => {
  let nextState;
  switch (action.type) {
    case REHYDRATE:
      // convert persisted data to Immutable and confirm rehydration
      if (!action.payload.auth || !action.payload.auth.token) {
        const { routes, index } = state;
        if (routes[index].routeName !== 'Signin') {
          nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({ routeName: 'Signin' }),
            state,
          );
        }
      }
      break;
    case 'LOGOUT':
      const { routes, index } = state;
      if (routes[index].routeName !== 'Signin') {
        nextState = AppNavigator.router.getStateForAction(
          NavigationActions.navigate({ routeName: 'Signin' }),
          state,
        );
      }
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

class AppWithNavigationState extends Component {
  render() {
    const { dispatch, nav } = this.props;
    return <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />;
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
};

const mapStateToProps = ({ auth, nav }) => ({
  auth,
  nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
