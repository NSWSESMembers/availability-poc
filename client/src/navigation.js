import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AppState } from 'react-native';
import { graphql, compose } from 'react-apollo';

import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import StackAuth from './screens/auth/StackAuth';
import StackAvailability from './screens/availability/StackAvailability';

import { Container } from './components/Container';
import UPDATE_TOKEN_MUTATION from './graphql/update-token.mutation';

import { firebaseClient } from './app';

import Home from './screens/home.screen';
import Groups from './screens/groups.screen';
import Group from './screens/group.screen';
import Events from './screens/events.screen';
import Settings from './screens/settings.screen';
import NewGroup from './screens/new-group.screen';
import SearchGroup from './screens/search-groups.screen';

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

const StackGroup = StackNavigator(
  {
    Index: {
      screen: Groups,
    },
    NewGroup: {
      screen: NewGroup,
    },
    SearchGroup: {
      screen: SearchGroup,
    },
    Group: {
      screen: Group,
    },
  },
  {
    headerMode: 'screen',
  },
);

const StackHome = StackNavigator(
  {
    Index: {
      screen: Home,
    },
  },
  {
    headerMode: 'screen',
  },
);

const StackEvents = StackNavigator(
  {
    Index: {
      screen: Events,
    },
  },
  {
    headerMode: 'screen',
  },
);

const StackSettings = StackNavigator(
  {
    Index: {
      screen: Settings,
    },
  },
  {
    headerMode: 'screen',
  },
);

// tabs in main screen
const MainScreenNavigator = TabNavigator(
  {
    Home: { screen: StackHome },
    Groups: { screen: StackGroup },
    Availability: { screen: StackAvailability },
    Events: { screen: StackEvents },
    Settings: { screen: StackSettings },
  },
  tabBarConfiguration,
);

// reducer initialization code
const firstAction = MainScreenNavigator.router.getActionForPathAndParams('Home');
const tempNavState = MainScreenNavigator.router.getStateForAction(firstAction);
const initialNavState = MainScreenNavigator.router.getStateForAction(tempNavState);

// reducer code
export const navigationReducer = (state = initialNavState, action) => {
  let nextState;
  switch (action.type) {
    default:
      nextState = MainScreenNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

class AppNavState extends Component {
    state = {
      appState: AppState.currentState,
      token: '',
    }

    componentWillMount() {
      AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillReceiveProps(nextProps) {
      console.log(nextProps);

      if (this.props.auth.token) {
        firebaseClient.init().then((registrationId) => {
          if (this.props.auth && this.props.registrationId !== this.state.token) {
            this.setState({ token: registrationId });
            return Promise.resolve(this.props.updateToken({ token: registrationId }));
          }
          return Promise.resolve();
        });
      }

      if (!nextProps.auth) {
        if (firebaseClient.token) {
          firebaseClient.clear();
        }
      }
    }

    componentWillUnmount() {
      AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange = (nextAppState) => {
      console.log('App has changed state!', nextAppState);
      console.log('From: ', this.state.appState);
      this.setState({ appState: nextAppState });
    }

    render() {
      const { dispatch, nav } = this.props;

      if (this.props.auth.loading) {
        return <Container />;
      }

      if (!this.props.auth.username) {
        return <StackAuth />;
      }

      return <MainScreenNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />;
    }
}

AppNavState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.shape().isRequired,
  auth: PropTypes.shape().isRequired,
  updateToken: PropTypes.func,
  token: PropTypes.string,
  registrationId: PropTypes.string,
};

const updateTokenMutation = graphql(UPDATE_TOKEN_MUTATION, {
  props: ({ mutate }) => ({
    updateToken: token =>
      mutate({
        variables: { token },
      }),
  }),
});

const mapStateToProps = ({ auth, nav }) => ({
  auth,
  nav,
});

export default compose(connect(mapStateToProps), updateTokenMutation)(AppNavState);
