import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  Button,
  View,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = -34.426498294;
const LONGITUDE = 150.876496494;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class EventHeader extends React.Component {
  static makeMarkers(responses) {
    function randomColor() {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    function createHomeMarker() {
      return {
        id: 'home',
        latitude: LATITUDE,
        longitude: LONGITUDE,
      };
    }

    const markers = [
      createHomeMarker(),
    ];
    responses.forEach((r) => {
      if (r.locationLatitude !== null && r.locationLongitude !== null) {
        markers.push({
          id: r.user.username,
          latitude: r.locationLatitude,
          longitude: r.locationLongitude,
          color: randomColor(),
        });
      }
    });
    return markers;
  }

  mapIsReady = () => {
    const markers = EventHeader.makeMarkers(this.props.event.responses);
    const markerIds = markers.map(m => m.id);
    this.focusMap(markerIds, false);
  }

  focusMap(markers, animated) {
    this.map.fitToSuppliedMarkers(markers, animated);
  }

  render() {
    const { name, details, responses } = this.props.event;

    const markers = EventHeader.makeMarkers(responses);

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
          onMapReady={this.mapIsReady}
          ref={(ref) => { this.map = ref; }}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          style={styles.map}
        >
          {markers.map(marker => (
            <Marker
              key={marker.id}
              identifier={marker.id}
              coordinate={marker}
              pinColor={marker.color}
            />
          ))}
        </MapView>
      </View>
    );
  }
}
EventHeader.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string,
    details: PropTypes.string,
    responses: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
          displayName: PropTypes.string.isRequired,
        }),
        locationLatitude: PropTypes.float,
        locationLongitude: PropTypes.float,
        status: PropTypes.string.isRequired,
        detail: PropTypes.string.isRequired,
      }),
    ),
  }),
};

class EventResponse extends Component {
  onPressEdit = () => {
    this.props.onEdit(this.props.response);
  }

  render() {
    const { user, status, detail } = this.props.response;
    const userId = this.props.auth.id;
    const color = {
      responding: 'green',
      unavailable: 'red',
      enroute: 'green',
    }[status.toLowerCase()];
    const statusText = detail === '' ? status : `${status} - ${detail}`;
    const isMe = userId === user.id;
    return (
      <View style={styles.respondContainer}>
        <Icon name="user" size={24} color={color} />
        <View style={styles.respondTextContainer}>
          <Text style={styles.respondName} numberOfLines={1}>{user.displayName}</Text>
          <Text style={styles.respondStatus} numberOfLines={1}>{statusText}</Text>
        </View>
        { isMe ? <Button title="edit" onPress={this.onPressEdit} /> : null }
      </View>
    );
  }
}
EventResponse.propTypes = {
  auth: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  response: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
    status: PropTypes.string.isRequired,
    detail: PropTypes.string,
  }),
  onEdit: PropTypes.func,
};

class EventDetail extends Component {
  componentDidMount() {
    this.timer = setInterval(this.onRefresh, 5000); // 5s
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

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
    return [item[0], result(item[1])];
  }

  editResponse = (eventResponse) => {
    const { navigate } = this.props.navigation;
    navigate('EventResponseEdit', { eventResponse, eventId: this.props.event.id });
  }

  renderItem = ({ item }) => {
    if (item[0] === 'info') {
      return <EventHeader event={item[1]} />;
    }

    return (
      <EventResponse
        response={item[1]}
        auth={this.props.auth}
        onEdit={this.editResponse}
      />
    );
  };

  render() {
    const { event, loading, networkStatus } = this.props;
    console.log(event);

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
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  auth: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    responses: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
          displayName: PropTypes.string.isRequired,
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
