import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabNavigator } from 'react-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';


import { isLoggedIn } from '../selectors/auth';
import HomeNavigator from './HomeNavigator';
import AvailabilityNavigator from './AvailabilityNavigator';
import GroupsNavigator from './GroupsNavigator';
import EventsNavigator from './EventsNavigator';
import BurgerNavigator from './BurgerNavigator';

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
const MainTabNavigator = TabNavigator(
  {
    Home: { screen: HomeNavigator },
    Groups: { screen: GroupsNavigator },
    Availability: { screen: AvailabilityNavigator },
    Events: { screen: EventsNavigator },
    More: { screen: BurgerNavigator },
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
      <MainTabNavigator />
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
