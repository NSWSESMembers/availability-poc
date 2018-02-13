/* global navigator */
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
import moment from 'moment';
import _ from 'lodash';

import { extendAppStyleSheet } from './style-sheet';
import EVENT_QUERY from '../graphql/event.query';
import SET_EVENT_RESPONSE_MUTATION from '../graphql/set-event-response.mutation';
import markers from '../assets/images/map/markers';
import { UserMarker } from '../components/MapMarker/';

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
  static makeEventLocations(eventLocations) {
    const mapMarkers = [];

    eventLocations.forEach((r) => {
      if (r.locationLatitude !== null && r.locationLongitude !== null) {
        mapMarkers.push({
          id: r.name,
          latitude: r.locationLatitude,
          longitude: r.locationLongitude,
          image: markers(r.icon),
        });
      }
    });
    return mapMarkers;
  }
  static makeResponseMarkers(responses) {
    const mapMarkers = [];

    responses.forEach((r) => {
      if (r.locationLatitude !== null && r.locationLongitude !== null) {
        mapMarkers.push({
          displayName: r.user.displayName,
          id: r.user.username,
          latitude: r.locationLatitude,
          longitude: r.locationLongitude,
        });
      }
    });
    return mapMarkers;
  }

  mapIsReady = () => {
    this.focusMap(false);
  }

  focusMap(animated) {
    this.map.fitToElements(animated);
  }

  render() {
    const { name, details, responses, eventLocations } = this.props.event;

    const mapResponseMarkers = EventHeader.makeResponseMarkers(responses);
    const mapEventLocations = EventHeader.makeEventLocations(eventLocations);

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
          {mapResponseMarkers.map(marker => (
            <Marker
              coordinate={marker}
              key={marker.id}
            >
              <UserMarker
                name={marker.displayName}
              />
            </Marker>
          ))}
          {mapEventLocations.map(marker => (
            <Marker
              title={marker.id}
              key={marker.id}
              identifier={marker.id}
              coordinate={marker}
              image={marker.image}
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
    eventLocations: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        detail: PropTypes.string,
        icon: PropTypes.string,
        locationLatitude: PropTypes.float,
        locationLongitude: PropTypes.float,
      }),
    ),
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
    const { user, status, detail, eta } = this.props.response;
    const userId = this.props.auth.id;
    const color = {
      attending: 'green',
      unavailable: 'red',
      enroute: 'green',
    }[status.toLowerCase()];
    const etaText = eta === 0 ? '' : `- ETA ${moment.unix(eta).fromNow()}`;
    const statusText = detail === ''
      ? `${status} ${etaText}`
      : `${status} - ${detail} ${etaText}`;
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
    eta: PropTypes.number,
    destination: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }),
  onEdit: PropTypes.func,
};

class EventDetail extends Component {
  componentDidMount() {
    this.timer = setInterval(this.onRefresh, 5000); // 5s
    this.manageLocationTracking();
  }

  componentDidUpdate() {
    this.manageLocationTracking();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    if (this.geoWatch !== null) {
      navigator.geolocation.clearWatch(this.geoWatch);
      this.geoWatch = null;
    }
  }

  onRefresh = () => {
    // NYI
    this.props.refetch();
  }

  manageLocationTracking() {
    const { props } = this;
    if (!this.props.event) {
      return;
    }
    const responding = props.event.responses.some(
      r => props.auth.id === r.user.id && r.status.toLowerCase() === 'responding',
    );

    if (responding && this.geoWatch === null) {
      this.geoWatch = navigator.geolocation.watchPosition(
        (position) => {
          this.updateLocation(props, position);
        },
        (err) => {
          console.log(`Unable to update location: ${err}`);
        },
        { enableHighAccuracy: true, maximumAge: 1000 },
      );
    } else if (!responding && this.geoWatch !== null) {
      navigator.geolocation.clearWatch(this.geoWatch);
      this.geoWatch = null;
    }
  }

  updateLocation = _.throttle((props, position) => {
    const { latitude, longitude } = position.coords;
    props
      .setEventResponseQuery({
        id: props.event.id,
        locationLatitude: latitude,
        locationLongitude: longitude,
      })
      .then(() => {
        console.log('location updated');
      })
      .catch((err) => {
        console.log(`Failed to update location: ${latitude},${longitude} (${err})`);
      });
  }, 4000);

  geoWatch = null;

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

const setEventResponse = graphql(SET_EVENT_RESPONSE_MUTATION, {
  props: ({ mutate }) => ({
    setEventResponseQuery: response =>
      mutate({
        variables: { response },
        refetchQueries: [
          {
            query: EVENT_QUERY,
            variables: { eventId: response.id },
          },
        ],
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  userQuery,
  setEventResponse,
)(EventDetail);
