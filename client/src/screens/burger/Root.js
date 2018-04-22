/* global navigator */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Text } from 'react-native';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import DeviceInfo from 'react-native-device-info';
import codePush from 'react-native-code-push';

import { Button } from '../../components/Button';
import { Center } from '../../components/Container';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';
import UPDATE_LOCATION_MUTATION from '../../graphql/update-location.mutation';
import UPDATE_USERPROFILE_MUTATION from '../../graphql/update-userprofile.mutation';
import { logout } from '../../state/auth.actions';
import { bugsnag } from '../../app';

const updateLocationMutation = graphql(UPDATE_LOCATION_MUTATION, {
  props: ({ mutate }) => ({
    updateLocation: ({ locationLat, locationLon }) =>
      mutate({
        variables: { loc: { locationLat, locationLon } },
      }),
  }),
});

const updateUserProfileMutation = graphql(UPDATE_USERPROFILE_MUTATION, {
  props: ({ mutate }) => ({
    updateUserProfile: ({ displayName }) =>
      mutate({
        variables: { user: { displayName } },
      }),
  }),
});

class Root extends Component {
  static navigationOptions = {
    title: 'More',
  };

  updateLocation = () => {
    const reportError = (error) => {
      Alert.alert('Error updating location', error.message);
    };

    // `navigator` is a browser polyfill and does not need to be imported
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.props
          .updateLocation({ locationLat: latitude, locationLon: longitude })
          .then((result) => {
            const success = result.data.updateLocation;
            console.log(`Updated location: ${latitude},${longitude} (${success})`);
          })
          .catch((err) => {
            console.log(`Failed to update location: ${latitude},${longitude} (${err})`);
            reportError(err);
          });
      },
      (err) => {
        reportError(err);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  showUserProfile = () => {
    const { navigation } = this.props;
    navigation.push('Profile');
  }

  logout = () => {
    this.props.dispatch(logout());
    // we don't need to navigate here because <MainNavigator /> will detect the change to the
    // `auth` prop and automatically navigate away
  }

  about = () => {
    const deviceInfoAvailable = DeviceInfo.typeof === undefined;

    codePush.getCurrentPackage().then((result) => {
      Alert.alert(
        'About',
        `
        getBundleId: ${deviceInfoAvailable ? DeviceInfo.getBundleId() : 'NA'}
        BuildNumber: ${deviceInfoAvailable ? DeviceInfo.getBuildNumber() : 'NA'}
        getReadableVersion: ${deviceInfoAvailable ? DeviceInfo.getReadableVersion() : 'NA'}
        CodePushlabel: ${result ? result.label : 'No CP package installed'}
        CodePushHash: ${result ? result.packageHash : 'No CP package installed'}
        `,
      );
    });
  }

  checkForUpdate = () => {
    codePush.checkForUpdate()
      .then((update) => {
        if (update) {
          Alert.alert(
            'Update Available',
            `Version ${update.appVersion} (${(update.packageSize / 1024 / 1024).toFixed(2)}mb) is available for download`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Install & Restart', onPress: this.installUpdate },
            ],
            { cancelable: false },
          );
        } else {
          Alert.alert('No updates available.');
        }
      });
  }

  installUpdate = () => {
    codePush.sync({ updateDialog: false, installMode: codePush.InstallMode.IMMEDIATE });
  }

  crashReport = () => {
    if (bugsnag) {
      bugsnag.notify(new Error('Test error'));
    }
  };

  render() {
    return (
      <Center>
        <Text />
        <Button text="User Profile" onPress={this.showUserProfile} />
        <Text />
        <Text />
        <Button text="Force Update Location" onPress={this.updateLocation} />
        <Text />
        <Text />
        <Button text="Check For Updates" onPress={this.checkForUpdate} />
        <Text />
        <Text />
        <Button text="Test Bugsnag" onPress={this.crashReport} />
        <Text />
        <Text />
        <Button text="About" onPress={this.about} />
        <Text />
        <Text />
        <Button text="Logout" onPress={this.logout} />
      </Center>
    );
  }
}

Root.propTypes = {
  dispatch: PropTypes.func.isRequired,
  updateLocation: PropTypes.func,
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ({ auth }) => ({ variables: { id: auth.id }, fetchPolicy: 'cache-only' }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  userQuery,
  updateUserProfileMutation,
  updateLocationMutation,
)(Root);
