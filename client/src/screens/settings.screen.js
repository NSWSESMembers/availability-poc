import React, { Component, PropTypes } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/FontAwesome';

import { extendAppStyleSheet } from './style-sheet';
import CURRENT_USER_QUERY from '../graphql/current-user.query';
import UPDATE_LOCATION_MUTATION from '../graphql/updateLocation.mutation';
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
  email: {
    borderColor: '#777',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    fontSize: 12,
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
  },
  userImage: {
    paddingHorizontal: 20,
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
  userInner: {
    flexDirection: 'row',
    backgroundColor: '#dbdbdb',
    alignItems: 'center',
    paddingVertical:8,
    paddingRight: 0,
  },
  inputBorder: {
    backgroundColor: '#ed3434',
  },
});

class Settings extends Component {
  static navigationOptions = {
    title: 'Settings',
    tabBarIcon: ({ tintColor}) => <Icon size={28} name={'cog'} color={tintColor} />
  };

  constructor(props) {
    super(props);

    this.state = {};

    this.logout = this.logout.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
  }

  updateLocation() {
    const reportError = (error) => {
      Alert.alert(
        'Error updating location',
        error.message,
      );
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.updateLocation({locationLat: position.coords.latitude, locationLon: position.coords.longitude})
        .then((result) => {
          console.log('Updated location:');
          console.log(result);
        })
        .catch((err) => {
          reportError(err);
        })
      },
      (error) => {
        reportError(err);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  logout() {
    this.props.dispatch(logout());
  }

  updateUsername(username) {
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
            <Icon
              name={'user'}
              size={50}
              style={styles.userImage}
            />
            <Text style={styles.inputInstructions}>
              {user.username}
            </Text>
          </View>
        </View>
        <Text style={styles.emailHeader}>{'Email Account'}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text></Text>
        <Text></Text>
        <Button title={'Force Update Location'} onPress={this.updateLocation}/>
        <Text></Text>
        <Text></Text>
        <Button title={'Logout'} onPress={this.logout} />
      </View>
    );
  }
}

Settings.propTypes = {
  auth: PropTypes.shape({
    loading: PropTypes.bool,
    token: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  updateLocation: PropTypes.func,
  user: PropTypes.shape({
    username: PropTypes.string,
  }),
};

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ({ auth }) => ({ variables: { id: auth.id }, fetchPolicy: 'cache-only' }),
  props: ({ data: { loading, user } }) => ({
    loading, user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  userQuery,
  updateLocationMutation,
)(Settings);
