/* global navigator */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, Button, Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/FontAwesome';
import md5 from 'react-native-md5';

import { extendAppStyleSheet } from './style-sheet';
import CURRENT_USER_QUERY from '../graphql/current-user.query';
import UPDATE_LOCATION_MUTATION from '../graphql/update-location.mutation';
import { logout } from '../state/auth.actions';

const updateLocationMutation = graphql(UPDATE_LOCATION_MUTATION, {
  props: ({ mutate }) => ({
    updateLocation: ({ locationLat, locationLon }) =>
      mutate({
        variables: { loc: { locationLat, locationLon } },
      }),
  }),
});

const styles = extendAppStyleSheet({
  container: {
    flex: 1,
  },
  username: {
    borderColor: '#777',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingBottom: 2,
    paddingTop: 5,
    fontSize: 14,
  },
  usernameHeader: {
    backgroundColor: '#dbdbdb',
    color: '#000000',
    paddingHorizontal: 8,
    paddingBottom: 2,
    paddingTop: 5,
    fontSize: 16,
  },
  email: {
    borderColor: '#777',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingBottom: 2,
    paddingTop: 5,
    fontSize: 14,
  },
  emailHeader: {
    backgroundColor: '#dbdbdb',
    color: '#000000',
    paddingHorizontal: 8,
    paddingBottom: 2,
    paddingTop: 5,
    fontSize: 16,
  },
  imageContainer: {
    paddingRight: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputBorder: {
    flexDirection: 'row',
    borderColor: '#dbdbdb',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 8,
    backgroundColor: '#ed3434',
  },
  inputInstructions: {
    color: '#777',
    fontSize: 26,
    flex: 1,
  },
  userContainer: {
    paddingLeft: 16,
    backgroundColor: '#c6c0c0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  gravatar: {
    paddingHorizontal: 10,
  },
  userInner: {
    flexDirection: 'row',
    backgroundColor: '#dbdbdb',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 0,
  },
});

class Settings extends Component {
  static navigationOptions = {
    title: 'Settings',
    tabBarIcon: ({ tintColor }) => <Icon size={28} name="cog" color={tintColor} />,
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

  logout = () => {
    this.props.dispatch(logout());
  }

  render() {
    const { loading, user } = this.props;

    // render loading placeholder while we fetch data
    if (loading || !user) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <View style={styles.userInner}>
            <View style={styles.gravatar}>
              <Image
                style={{ width: 50, height: 50, paddingHorizontal: 10 }}
                source={{ uri: `https://www.gravatar.com/avatar/${md5.hex_md5(user.email)}?d=mm` }}
              />
            </View>
            <Text style={styles.inputInstructions}>{user.displayName}</Text>
          </View>
        </View>
        <Text style={styles.usernameHeader}>User Name</Text>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.emailHeader}>Email Address</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text />
        <Text />
        <Button title="Force Update Location" onPress={this.updateLocation} />
        <Text />
        <Text />
        <Button title="Test Event Response" onPress={this.showEventResponse} />
        <Text />
        <Text />
        <Button title="Logout" onPress={this.logout} />
      </View>
    );
  }
}

Settings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  updateLocation: PropTypes.func,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }),
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

export default compose(connect(mapStateToProps), userQuery, updateLocationMutation)(Settings);
