/* global navigator */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Text } from 'react-native';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import DeviceInfo from 'react-native-device-info';
import codePush from 'react-native-code-push';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Button } from '../../components/Button';
import { Holder } from '../../components/Container';

import { extendAppStyleSheet } from '../style-sheet';
import CURRENT_USER_QUERY from '../../graphql/current-user.query';
import UPDATE_LOCATION_MUTATION from '../../graphql/update-location.mutation';
import UPDATE_USERPROFILE_MUTATION from '../../graphql/update-userprofile.mutation';
import { logout } from '../../state/auth.actions';

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

const styles = extendAppStyleSheet({
  container: {
    flex: 1,
  },
});

class Burger extends Component {
  static navigationOptions = {
    title: 'More',
    tabBarIcon: ({ tintColor }) => <Icon size={28} name="bars" color={tintColor} />,
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

  showEventResponse = () => {
    const { navigate } = this.props.navigation;
    navigate('EventResponse');
  }

  showUserProfile = () => {
    const { navigate } = this.props.navigation;
    navigate('Profile');
  }

  logout = () => {
    this.props.dispatch(logout());
  }

  about = () => {
    const DeviceInfoAvailable = DeviceInfo.typeof;

    codePush.getCurrentPackage().then((result) => {
      Alert.alert(
        'About',
        `
        getBundleId: ${DeviceInfoAvailable ? DeviceInfo.getBundleId() : 'NA'}
        BuildNumber: ${DeviceInfoAvailable ? DeviceInfo.getBuildNumber() : 'NA'}
        getReadableVersion: ${DeviceInfoAvailable ? DeviceInfo.getReadableVersion() : 'NA'}
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

    render() {
      return (
        <Holder style={styles.container}>
          <Text />
          <Button text="User Profile" onPress={this.showUserProfile} />
          <Text />
          <Text />
          <Button text="Force Update Location" onPress={this.updateLocation} />
          <Text />
          <Text />
          <Button text="Test Event Response" onPress={this.showEventResponse} />
          <Text />
          <Text />
          <Button text="Check For Updates" onPress={this.checkForUpdate} />
          <Text />
          <Text />
          <Button text="About" onPress={this.about} />
          <Text />
          <Text />
          <Button text="Logout" onPress={this.logout} />
        </Holder>
      );
    }
}

Burger.propTypes = {
  dispatch: PropTypes.func.isRequired,
  updateLocation: PropTypes.func,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
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
)(Burger);
