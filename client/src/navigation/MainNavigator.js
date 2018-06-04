import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import PropTypes from 'prop-types';
import { TabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { pushManager, bugsnag } from '../app';

import { isLoggedIn } from '../selectors/auth';
import HomeNavigator from './HomeNavigator';
import SchedulesNavigator from './SchedulesNavigator';
import GroupsNavigator from './GroupsNavigator';
import EventsNavigator from './EventsNavigator';
import BurgerNavigator from './BurgerNavigator';
import PushHandler from '../components/push/PushHandler';
import BugSnagUserHandler from '../components/bugsnag/BugSnagUserHandler';

import UPDATE_DEVICE_MUTATION from '../graphql/update-device.mutation';
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
    const { device, auth, updateDevice } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <PushHandler
          updateDevice={updateDevice}
          pushManager={pushManager}
          auth={auth}
          device={device}
        />
        <BugSnagUserHandler
          auth={auth}
          bugsnag={bugsnag}
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
  updateDevice: PropTypes.func.isRequired,
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

const updateDeviceMutation = graphql(UPDATE_DEVICE_MUTATION, {
  props: ({ mutate }) => ({
    updateDevice: device =>
      mutate({
        variables: { device },
        update: (store) => {
          // read the current device object, write in the new token, save it out
          const data = store.readQuery({ query: CURRENT_DEVICE_QUERY });
          store.writeQuery({ query: CURRENT_DEVICE_QUERY, data });
        },
      }),
  }),
});

const mapStateToProps = ({ auth, device }) => ({
  auth,
  device,
});

export default compose(
  updateDeviceMutation,
  connect(mapStateToProps),
  deviceQuery,
)(MainNavigator);
