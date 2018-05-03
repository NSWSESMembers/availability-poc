import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import PropTypes from 'prop-types';
import { TabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { pushManager } from '../app';
import { isLoggedIn } from '../selectors/auth';
import HomeNavigator from './HomeNavigator';
import SchedulesNavigator from './SchedulesNavigator';
import GroupsNavigator from './GroupsNavigator';
import EventsNavigator from './EventsNavigator';
import BurgerNavigator from './BurgerNavigator';
import PushHandler from '../components/push/PushHandler';

import UPDATE_TOKEN_MUTATION from '../graphql/update-token.mutation';
import CURRENT_DEVICE_QUERY from '../graphql/current-device.query';

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
    const { device, auth, updateToken } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <PushHandler
          updateToken={updateToken}
          pushManager={pushManager}
          auth={auth}
          device={device}
        />
        <MainTabNavigator screenProps={{ modalNavigation: this.props.navigation }} />
      </View>
    );
  }
}

MainNavigator.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  device: PropTypes.shape({
    pushToken: PropTypes.string,
  }),
  auth: PropTypes.shape().isRequired,
  updateToken: PropTypes.func.isRequired,
};

const deviceQuery = graphql(CURRENT_DEVICE_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, networkStatus, refetch, device } }) => ({
    loading,
    networkStatus,
    refetch,
    device,
  }),
});

const updateTokenMutation = graphql(UPDATE_TOKEN_MUTATION, {
  props: ({ mutate }) => ({
    updateToken: token =>
      mutate({
        variables: { token },
      }),
  }),
});

const mapStateToProps = ({ auth, device }) => ({
  auth,
  device,
});

export default compose(
  updateTokenMutation,
  connect(mapStateToProps),
  deviceQuery,
)(MainNavigator);
