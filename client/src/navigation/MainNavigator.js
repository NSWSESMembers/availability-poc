import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import PropTypes from 'prop-types';
import { TabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

import { isLoggedIn } from '../selectors/auth';
import HomeNavigator from './HomeNavigator';
import SchedulesNavigator from './SchedulesNavigator';
import GroupsNavigator from './GroupsNavigator';
import EventsNavigator from './EventsNavigator';
import BurgerNavigator from './BurgerNavigator';

import BugCatcher from '../components/bug/BugCatcher';

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
  componentDidUpdate() {
    const { auth } = this.props;
    if (!isLoggedIn(auth)) {
      console.log('User is not logged in - navigating to auth');
      this.props.navigation.navigate('Auth');
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <BugCatcher />
        <MainTabNavigator screenProps={{ modalNavigation: this.props.navigation }} />
      </View>
    );
  }
}

MainNavigator.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  auth: PropTypes.shape().isRequired,
};


const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps))(MainNavigator);
