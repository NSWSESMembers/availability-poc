import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import { extendAppStyleSheet } from './style-sheet';
import CURRENT_USER_QUERY from '../graphql/current-user.query';

const styles = extendAppStyleSheet({
  responseContainer: {
    paddingTop: 20,
    alignItems: 'center',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  responseButtonGreen: {
    backgroundColor: 'green',
    width: '100%',
    height: 300,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  responseButtonRed: {
    backgroundColor: '#990000',
    width: '100%',
    height: 300,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  responseButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
  },
  header: {
    fontSize: 48,
  },
  detail: {
    textAlign: 'left',
    padding: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  touchable: {
    width: '50%',
  },
});

class EventResponse extends Component {
  static navigationOptions = {
    header: null,
  };

  close = () => {
    const { goBack } = this.props.navigation;
    goBack();
  }

  render() {
    return (
      <View style={styles.responseContainer}>
        <Text style={styles.header}>Flood Rescue</Text>
        <Text style={styles.detail}>Situation On Scene:</Text>
        <Text style={styles.detail}>
          WHITE 4X4 UTE WITH CANOPY FLOATING DOWN THE RIVER WITH SOMEONE SITTING ON THE BONNET.
        </Text>
        <Text style={styles.detail}>SOUTH ARM ROAD, URUNGA NSW 2451</Text>
        <Text style={styles.detail}>Call SOC 1800-817-623</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.touchable} onPress={this.close}>
            <View style={styles.responseButtonGreen}>
              <Icon size={60} name="car" color="white" />
              <Text style={styles.responseButtonText}>Responding</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchable} onPress={this.close}>
            <View style={styles.responseButtonRed}>
              <Icon size={60} name="times" color="white" />
              <Text style={styles.responseButtonText}>Unavailable</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
EventResponse.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading, networkStatus, refetch, user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  userQuery,
)(EventResponse);
