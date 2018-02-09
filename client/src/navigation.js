import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AppState, NativeModules, BackHandler, ToastAndroid } from 'react-native';
import { graphql, compose } from 'react-apollo';

import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import StackAuth from './screens/auth/StackAuth';
import StackAvailability from './screens/availability/StackAvailability';
import StackHome from './screens/home/StackHome';

import { Container } from './components/Container';
import { Progress } from './components/Progress';

import UPDATE_TOKEN_MUTATION from './graphql/update-token.mutation';

import { firebaseClient } from './app';

import Groups from './screens/groups.screen';
import Group from './screens/group.screen';
import Events from './screens/events.screen';
import Event from './screens/event-detail.screen';
import Settings from './screens/settings.screen';
import NewGroup from './screens/new-group.screen';
import SearchGroup from './screens/search-groups.screen';
import EventResponse from './screens/event-response.screen';
import EventResponseEdit from './screens/event-response-edit.screen';

// this will determine whether the firebase modules have been compiled in or not
const firebaseAvailable = !!NativeModules.RNFIRMessaging;

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
    EventResponse: {
      screen: EventResponse,
    },
  },
  {
    mode: 'modal',
    headerMode: 'screen',
  },
);

// tabs in main screen
export const MainScreenNavigator = TabNavigator(
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

class AppNavState extends Component {
  constructor(props) {
    super(props);
    this.lastBackButtonPress = null;
  }
  state = {
    appState: AppState.currentState,
    token: '',
  };

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { dispatch, nav } = this.props;
      if (nav.index === 0) {
        if (this.lastBackButtonPress + 2000 >= new Date().getTime()) {
          BackHandler.exitApp();
          return true;
        }
        ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
        this.lastBackButtonPress = new Date().getTime();
      }
      dispatch({ type: 'Navigation/BACK' });
      return true;
    });
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.auth.token && firebaseAvailable) {
      firebaseClient.init().then((registrationId) => {
        if (this.props.auth && this.props.registrationId !== this.state.token) {
          this.setState({ token: registrationId });
          return Promise.resolve(this.props.updateToken({ token: registrationId }));
        }
        return Promise.resolve();
      });
    }

    if (!nextProps.auth && firebaseAvailable) {
      if (firebaseClient.token) {
        firebaseClient.clear();
      }
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    console.log('App has changed state!', nextAppState);
    console.log('From: ', this.state.appState);
    this.setState({ appState: nextAppState });
  };

  render() {
    const { dispatch, nav } = this.props;

    if (this.props.auth.loading) {
      return (
        <Container>
          <Progress />
        </Container>
      );
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
