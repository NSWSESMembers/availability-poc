import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AppState, BackHandler, ToastAndroid } from 'react-native';
import { compose } from 'react-apollo';

import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import StackAuth from './screens/auth/StackAuth';
import StackAvailability from './screens/availability/StackAvailability';
import StackHome from './screens/home/StackHome';
import StackGroups from './screens/groups/StackGroups';
import StackBurger from './screens/burger/StackBurger';
import StackEvents from './screens/events/StackEvents';
import { Container } from './components/Container';
import { Progress } from './components/Progress';

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
export const MainScreenNavigator = TabNavigator(
  {
    Home: { screen: StackHome },
    Groups: { screen: StackGroups },
    Availability: { screen: StackAvailability },
    Events: { screen: StackEvents },
    More: { screen: StackBurger },
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
};

const mapStateToProps = ({ auth, nav }) => ({
  auth,
  nav,
});

export default compose(connect(mapStateToProps))(AppNavState);
