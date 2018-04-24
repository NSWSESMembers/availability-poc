import React, { Component } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { TabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { isLoggedIn } from '../selectors/auth';
import { firebaseClient } from '../app';
import HomeNavigator from './HomeNavigator';
import SchedulesNavigator from './SchedulesNavigator';
import GroupsNavigator from './GroupsNavigator';
import EventsNavigator from './EventsNavigator';
import BurgerNavigator from './BurgerNavigator';

import UPDATE_TOKEN_MUTATION from '../graphql/update-token.mutation';

const fontSize = Platform.OS === 'ios' ? 10 : 8;

const tabBarConfiguration = {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    labelStyle: {
      fontSize,
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
const MainTabNavigator = TabNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        tabBarLabel: 'Home',
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ tintColor }) => <Icon size={34} name="home" color={tintColor} />,
      },
    },
    Groups: {
      screen: GroupsNavigator,
      navigationOptions: {
        tabBarLabel: 'Groups',
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ tintColor }) => <Icon size={24} name="group" color={tintColor} />,
      },
    },
    Schedules: {
      screen: SchedulesNavigator,
      navigationOptions: {
        tabBarLabel: 'Availability',
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ tintColor }) => <Icon size={24} name="calendar" color={tintColor} />,
      },
    },
    Events: {
      screen: EventsNavigator,
      navigationOptions: {
        tabBarLabel: 'Events',
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ tintColor }) => <Icon size={26} name="bullhorn" color={tintColor} />,
      },
    },
    More: {
      screen: BurgerNavigator,
      navigationOptions: {
        tabBarLabel: 'More',
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ tintColor }) => <Icon size={28} name="bars" color={tintColor} />,
      },
    },
  },
  tabBarConfiguration,
);

// this wrapper exists simply to detect when we have logged out so that we can navigate back to the
// auth screen
class MainNavigator extends Component {
  state = {
    token: '',
  }


  componentDidUpdate() {
    const { auth } = this.props;
    if (!isLoggedIn(auth)) {
      console.log('User is not logged in - navigating to auth');
      this.props.navigation.navigate('Auth');
    }
  }


  render() {
    const { auth } = this.props;
    if (!isLoggedIn(auth)) {
      if (firebaseClient.token) {
        firebaseClient.clear();
      }
    } else {
      // TODO: we shouldnt store token in state we should store it in redux
      // because it doesnt change unless you clear data or change device
      firebaseClient.init().then((registrationId) => {
        if (registrationId !== this.state.token) {
          this.setState({ token: registrationId });
          return Promise.resolve(this.props.updateToken({ token: registrationId }));
        }
        return Promise.resolve();
      });
    }


    return (
      <MainTabNavigator screenProps={{ modalNavigation: this.props.navigation }} />
    );
  }
}

MainNavigator.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  auth: PropTypes.shape().isRequired,
  updateToken: PropTypes.func,
};

const updateTokenMutation = graphql(UPDATE_TOKEN_MUTATION, {
  props: ({ mutate }) => ({
    updateToken: token =>
      mutate({
        variables: { token },
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(updateTokenMutation, connect(mapStateToProps))(MainNavigator);
