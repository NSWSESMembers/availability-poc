import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import _ from 'lodash';

import { extendAppStyleSheet } from './style-sheet';
import EVENT_QUERY from '../graphql/event.query';

const styles = extendAppStyleSheet({
  respondContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  respondName: {
    fontWeight: 'bold',
    flex: 1,
  },
  respondTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  respondStatus: {
    flex: 1,
    color: '#8c8c8c',
    fontSize: 11,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  headerName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerDetail: {
  },
  map: {
    backgroundColor: '#f9f9f9',
    flex: 1,
    flexDirection: 'row',
    height: 300,
  },
  placeholder: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 48,
    textAlign: 'center',
  },
});

const EventHeader = (props) => {
  const { name, details } = props.event;

  return (
    <View>
      <View style={styles.headerContainer}>
        <Icon name="bullhorn" size={48} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerName} numberOfLines={1}>{name}</Text>
          <Text style={styles.headerDetail} numberOfLines={3}>{details}</Text>
        </View>
      </View>
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}
      />
    </View>
  );
};
EventHeader.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string,
    detail: PropTypes.string,
  }),
};

const EventResponse = (props) => {
  const { user, status, detail } = props.response;
  const color = {
    responding: 'green',
    unavailable: 'red',
    enroute: 'green',
  }[status.toLowerCase()];
  return (
    <View style={styles.respondContainer}>
      <Icon name="user" size={24} color={color} />
      <View style={styles.respondTextContainer}>
        <Text style={styles.respondName} numberOfLines={1}>{user.username}</Text>
        <Text style={styles.respondStatus} numberOfLines={1}>{status} - {detail}</Text>
      </View>
    </View>
  );
};
EventResponse.propTypes = {
  response: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string.required,
    }),
    status: PropTypes.string.required,
    detail: PropTypes.string,
  }),
};

class EventDetail extends Component {
  onRefresh = () => {
    // NYI
    this.props.refetch();
  }

  keyExtractor = (item) => {
    const result = {
      info: i => i.id,
      response: i => i.user.id,
    }[item[0]];
    if (typeof result === 'undefined') {
      throw Error(`Invalid item: ${item}`);
    }
    return result(item[1]);
  }

  renderItem = ({ item }) => {
    if (item[0] === 'info') {
      return <EventHeader event={item[1]} />;
    }

    return (
      <EventResponse
        response={item[1]}
      />
    );
  };

  render() {
    const { event, loading, networkStatus } = this.props;

    // render loading placeholder while we fetch messages
    if (loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    if (!event) {
      return (
        <View style={styles.container}>
          <Text style={styles.warning}>
            Unable to load event.
          </Text>
        </View>
      );
    }

    const rows = [
      ['info', event],
    ].concat(_.map(event.responses, r => ['response', r]));

    // render list of groups for user
    return (
      <View style={styles.container}>
        <FlatList
          data={rows}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          extraData={event} // redraw if this changes
          refreshing={networkStatus === 4}
        />
      </View>
    );
  }
}
EventDetail.propTypes = {
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    responses: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
        }),
        status: PropTypes.string.isRequired,
        detail: PropTypes.string.isRequired,
      }),
    ),
  }),
};

const userQuery = graphql(EVENT_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ({ navigation }) => ({ variables: { eventId: navigation.state.params.id } }),
  props: ({ data: { loading, event, refetch } }) => ({
    loading, event, refetch,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  userQuery,
)(EventDetail);
