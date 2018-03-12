/* global navigator */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { extendAppStyleSheet } from '../style-sheet';
import EVENT_QUERY from '../../graphql/event.query';
import SET_EVENT_RESPONSE_MUTATION from '../../graphql/set-event-response.mutation';
import markers from '../../assets/images/map/markers';
import { UserMarker } from '../../components/MapMarker/';
import { Container, Holder } from '../../components/Container';
import { ListItem } from '../../components/List';

import { Progress } from '../../components/Progress';

const styles = extendAppStyleSheet({
  map: {
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
    zIndex: -1,
    ...StyleSheet.absoluteFillObject,
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
          status: r.status,
          destination: r.destination && r.destination.name,
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
  };

  focusMap(animated) {
    this.map.fitToElements(animated);
  }

  render() { // TODO: use peralink for external linking
    const {
      name,
      details,
      permalink, // eslint-disable-line no-unused-vars
      responses,
      eventLocations,
    } = this.props.event;

    const mapResponseMarkers = EventHeader.makeResponseMarkers(responses);
    const mapEventLocations = EventHeader.makeEventLocations(eventLocations);
    // TODO: permalink support opens url in brower
    return (
      <View style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>
        <View style={{ top: 6 }}>
          <Holder wide transparent>
            <ListItem
              wide
              title={name}
              bold
              subtitle={details}
              icon="external-link"
              onPress={() => undefined}
            />
          </Holder>
        </View>
        <MapView
          onMapReady={this.mapIsReady}
          ref={(ref) => {
            this.map = ref;
          }}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          style={styles.map}
        >
          {mapResponseMarkers.map(marker => (
            <Marker coordinate={marker} key={marker.id}>
              <UserMarker
                name={marker.displayName}
                status={marker.status}
                destination={marker.destination}
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
    permalink: PropTypes.string,
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

class EventDetail extends Component {
  static navigationOptions = {
    title: 'Event Detail',
    tabBarLabel: 'Events',
    tabBarIcon: ({ tintColor }) => <Icon size={26} name="bullhorn" color={tintColor} />,
  };

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
  };

  manageLocationTracking() {
    const { props } = this;
    if (!this.props.event) {
      return;
    }

    const myStatus = props.event.responses.find(r => props.auth.id === r.user.id);
    if (myStatus) {
      if (myStatus.status.toLowerCase() !== 'unavailable' && this.geoWatch === null) {
        this.geoWatch = navigator.geolocation.watchPosition(
          (position) => {
            this.updateLocation(props, position);
          },
          (err) => {
            console.log(`Unable to update location: ${err}`);
          },
          { enableHighAccuracy: true, maximumAge: 1000 },
        );
      } else if (myStatus.status.toLowerCase() !== 'responding' && this.geoWatch !== null) {
        navigator.geolocation.clearWatch(this.geoWatch);
        this.geoWatch = null;
      }
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

  editResponse = (eventResponse) => {
    const { navigate } = this.props.navigation;
    navigate('EventResponseEdit', {
      eventResponse,
      eventId: this.props.event.id,
      eventLocations: this.props.event.eventLocations,
    });
  };

  eventUsers = () => {
    const { navigate } = this.props.navigation;
    navigate('EventUsers', {
      eventId: this.props.event.id,
    });
  };

  render() {
    const { event, loading } = this.props;
    if (loading) {
      return (
        <Container>
          <Progress />
        </Container>
      );
    }

    if (!event) {
      return (
        <Container>
          <Text style={styles.warning}>Unable to load event.</Text>
        </Container>
      );
    }

    const myStatus = this.props.event.responses.find(
      r => this.props.auth.id === r.user.id,
    );

    const attendingUsers = [];
    const unavailableUsers = [];
    const summaryByDestinationUsers = {};

    event.responses.forEach((r) => {
      if (r.destination) { // make object of reponses by destination name
        if (!_.has(summaryByDestinationUsers, r.destination.name)) {
          summaryByDestinationUsers[r.destination.name] = [];
        }
        summaryByDestinationUsers[r.destination.name].push(r);
      }
      switch (r.status) {
        case 'unavailable':
          unavailableUsers.push(r);
          break;
        case 'attending':
          attendingUsers.push(r);
          break;
        default:
          break;
      }
    });

    // TODO: not like this im guessing
    const summaryByDestinationUsersArray = [];
    _.keys(summaryByDestinationUsers).forEach((r) => {
      summaryByDestinationUsersArray.push(`${summaryByDestinationUsers[r].length} to ${r.toUpperCase()}`);
    });
    const summaryByDestinationUsersString = summaryByDestinationUsersArray.join(', ');

    return (
      <View style={{ flex: 1 }}>
        <EventHeader event={event} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <Holder wide transparent>
            <ListItem
              wide
              bold
              title={myStatus ? (`I am ${myStatus.status.toUpperCase()}`) : 'I have not answered'}
              subtitle={myStatus ? (`Destination ${myStatus.destination.name.toUpperCase()}, ETA ${moment(myStatus.destination.eta).fromNow()}`) : 'No destination set'}
              icon="location-arrow"
              onPress={() => this.editResponse(myStatus)}
            />
            <ListItem
              wide
              bold
              title={`${attendingUsers.length} people are attending`}
              subtitle={summaryByDestinationUsersString}
              icon="group"
              onPress={this.eventUsers}
            />
          </Holder>
        </View>
      </View>
    );
  }
}
EventDetail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  refetch: PropTypes.func,
  auth: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    sourceIdentifier: PropTypes.string,
    permalink: PropTypes.string,
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
        status: PropTypes.string.isRequired,
        detail: PropTypes.string.isRequired,
      }),
    ),
  }),
};

const eventQuery = graphql(EVENT_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ({ navigation }) => ({ variables: { eventId: navigation.state.params.id } }),
  props: ({ data: { loading, event, refetch } }) => ({
    loading,
    event,
    refetch,
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

export default compose(connect(mapStateToProps), eventQuery, setEventResponse)(EventDetail);
