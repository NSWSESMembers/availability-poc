/* global navigator */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { extendAppStyleSheet } from '../style-sheet';
import EVENT_QUERY from '../../graphql/event.query';
import SET_EVENT_RESPONSE_MUTATION from '../../graphql/set-event-response.mutation';
import { UserMarker, IconMarker, MyLocationMarker, AccuracyHalo } from '../../components/MapMarker/';
import { Container, Holder } from '../../components/Container';
import { ListItemHighlight } from '../../components/List';
import { Progress } from '../../components/Progress';
import { ButtonNavBar } from '../../components/Button';
import MapDelta from '../../selectors/MapDelta';

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


class Detail extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Event Detail',
    headerRight: <ButtonNavBar onPress={() => navigation.state.params.handleThis()} icon="mi-my-location" />,
  });


  static makeEventLocations(eventLocations) {
    const mapMarkers = [];

    eventLocations.forEach((r) => {
      if (r.locationLatitude !== null && r.locationLongitude !== null) {
        mapMarkers.push({
          id: r.name,
          latitude: r.locationLatitude,
          longitude: r.locationLongitude,
          icon: r.icon,
        });
      }
    });
    return mapMarkers;
  }
  static makeResponseMarkers(userid, responses) {
    const mapMarkers = [];
    if (responses) {
      responses.forEach((r) => {
        if (r.locationLatitude !== null && r.locationLongitude !== null) {
          if (r.user.id !== userid) {
            mapMarkers.push({
              displayName: r.user.displayName,
              status: r.status,
              destination: r.destination && r.destination.name,
              locationTime: moment.unix(r.locationTime).fromNow(),
              id: r.user.username,
              latitude: r.locationLatitude,
              longitude: r.locationLongitude,
            });
          }
        }
      });
    }
    return mapMarkers;
  }

  state = {
    myPosition: null,
    eventMarkers: null,
    responseMarkers: null,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handleThis: this.mapZoomMe,
    });
    this.refreshTimer = setInterval(this.onRefresh, 5000); // 5s
    this.locationTimeoutTimer = setTimeout(this.locationTimeout, 10000); // 10s
    if (Platform.OS === 'android') {
      this.androidLocationPermission().then((answer) => {
        if (answer === true) {
          this.watchLocation();
        }
      });
    } else {
      this.watchLocation();
    }
  }


  componentWillReceiveProps(newProps) {
    // catch incoming props and generate the marker states
    const { event, loading, auth } = newProps;
    if (!loading && event) {
      this.setState({
        responseMarkers: Detail.makeResponseMarkers(
          auth.id, event.responses,
        ),
      });
      this.setState({
        eventMarkers: Detail.makeEventLocations(event.eventLocations),
      });
    }
  }

  componentDidUpdate() {
    this.watchLocation();
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
    if (this.geoWatch !== null) {
      navigator.geolocation.clearWatch(this.geoWatch);
      this.geoWatch = null;
    }
  }

  onRefresh = () => {
    // NYI very well
    this.props.refetch();
  };

  geoWatch = null


  locationTimeout = () => {
  // if we dont have a location yet, give some feedback to the user
    if (!this.state.myPosition) {
      Alert.alert('Unable to locate you', 'We are unable to locate you. Check that location services are enabled');
    }
  }

  androidLocationPermission = async () => {
    console.log('Checking android permissions');
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permission Needed',
        message: 'We need permission to track your location accurately.',
      },
    );
    console.log('permissions:', granted);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  mapZoomMe = () => {
    if (this.state.myPosition) {
      const { longitude, latitude } = this.state.myPosition;
      const myLocation = MapDelta(
        latitude,
        longitude,
        500, // 500m height
      );
      this.zoomToRegionMap(myLocation);
    }
  }

  mapOnLayout = () => {
    let mergedpoints = [];
    if (this.state.myPosition) {
      const { longitude, latitude } = this.state.myPosition;
      const myLocation = [{
        longitude,
        latitude,
      }];
      mergedpoints = myLocation.concat(this.state.eventMarkers);
    } else {
      mergedpoints = this.state.eventMarkers;
    }
    // Zoom to the user and events if possible, otherwise start around events

    this.zoomMap(mergedpoints);
  }

  zoomMap(fitToTheseCoordinates) {
    this.map.fitToCoordinates(
      fitToTheseCoordinates,
      {
        edgePadding: {
          top: 300,
          right: 100,
          bottom: 300,
          left: 100,
        },
        animated: true,
      },
    );
  }

  zoomToRegionMap(fitToTheseCoordinates) {
    this.map.animateToRegion(
      fitToTheseCoordinates,
    );
  }

  watchLocation() {
    if (!this.props.event) {
      return;
    }
    // If this is the first run start a single fuzzy location fix acquisition
    if (this.geoWatch == null) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.processReturnedLocation(position, false);
      }, (err) => {
        console.log(err);
      });

      // start a accurate fix watcher
      this.geoWatch = navigator.geolocation.watchPosition(
        (position) => {
          this.processReturnedLocation(position, true);
        }, (err) => {
          console.log(err);
        },
        { enableHighAccuracy: true, maximumAge: 0, distanceFilter: 0, timeout: 0 },
      );
    }
  }

  processReturnedLocation = (position, highAccuracy) => {
    const { props } = this;
    const myLastPosition = this.state.myPosition;
    const myPosition = position.coords;
    // if we already have a high accuracy location ignore this fuzzy location
    if ((!highAccuracy && !myLastPosition) || highAccuracy) {
      if (!_.isEqual(myPosition, myLastPosition)) {
        this.setState({ myPosition }, () => {
        // on first update of user location, zoom to fit
        // we will assume that the fuzzy one comes back first
          if (myLastPosition === null) {
            this.mapOnLayout();
          }
        });
        const myStatus = this.props.event.responses.find(
          r => this.props.auth.id === r.user.id,
        );
        if (myStatus) {
          if (myStatus.status.toLowerCase() !== 'unavailable') {
            this.updateLocation(props, position);
          }
        }
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
        locationTime: Math.floor(position.timestamp / 1000), // seconds not milliseconds
      })
      .then(() => {
        console.log('location change sent');
      })
      .catch((err) => {
        console.log(`Failed to send location change: ${latitude},${longitude} (${err})`);
      });
  }, 4000);

  editResponse = () => {
    const { navigation } = this.props;
    navigation.push('EventEditResponse', {
      eventId: this.props.event.id,
    });
  };

  goToResponses = () => {
    const { navigation } = this.props;
    navigation.push('EventResponses', {
      eventId: this.props.event.id,
    });
  };

  openExternal = () => {
    Linking.openURL(this.props.event.permalink);
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
    const summaryByDestinationUsersString = summaryByDestinationUsersArray.length ? summaryByDestinationUsersArray.join(', ') : 'No responses yet';

    const userSubtitleArray = [];
    userSubtitleArray.push(myStatus && myStatus.destination ? `Destination ${myStatus.destination.name.toUpperCase()}` : 'Destination not set');
    userSubtitleArray.push(myStatus && myStatus.eta !== 0 ? `ETA ${moment.unix(myStatus.eta).fromNow()}` : 'ETA not set');
    const userSubtitleString = userSubtitleArray.join(', ');


    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>
          <View
            style={{ top: 6 }}
          >
            <Holder wide transparent>
              <ListItemHighlight
                wide
                title={event.name}
                subtitle={event.details}
                icon="external-link"
                onPress={this.openExternal}
                selectable
              />
            </Holder>
          </View>
          <MapView
            onMapReady={this.mapOnLayout}
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
            <MyLocationMarker
              myPosition={this.state.myPosition}
            />
            <AccuracyHalo
              myPosition={this.state.myPosition}
            />
            {this.state.responseMarkers && this.state.responseMarkers.map(marker => (
              <Marker coordinate={marker} key={`user${marker.id}`}>
                <UserMarker
                  name={marker.displayName}
                  status={marker.status}
                  destination={marker.destination}
                  locationTime={`Updated ${marker.locationTime}`}
                />
              </Marker>
            ))}
            {this.state.eventMarkers && this.state.eventMarkers.map(marker => (
              <Marker
                key={`marker${marker.id}`}
                coordinate={marker}
                style={{ zIndex: 1, opacity: 0.9 }} // apear onto of others
              // TODO: anchor & centerOffset
              >
                <IconMarker
                  name={marker.icon}
                />
              </Marker>
            ))}
          </MapView>
        </View>
        <View
          style={{ position: 'absolute', bottom: 6, left: 0, right: 0 }}
        >
          <Holder wide transparent>
            <ListItemHighlight
              wide
              title={myStatus ? (`I am ${myStatus.status.toUpperCase()}`) : 'I have not answered'}
              subtitle={userSubtitleString}
              icon="location-arrow"
              onPress={() => this.editResponse()}
            />
            <ListItemHighlight
              wide
              title={`${attendingUsers.length} people are attending`}
              subtitle={summaryByDestinationUsersString}
              icon="group"
              onPress={this.goToResponses}
            />
          </Holder>
        </View>
      </View>
    );
  }
}
Detail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setParams: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.object,
    }),
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
        locationTime: PropTypes.number,
      }),
    ),
    responses: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
          displayName: PropTypes.string.isRequired,
        }),
        status: PropTypes.string.isRequired,
        detail: PropTypes.string,
        eta: PropTypes.float,
      }),
    ),
  }),
};

const eventQuery = graphql(EVENT_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ({ navigation }) => ({ variables: { eventId: navigation.state.params.eventId } }),
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

export default compose(connect(mapStateToProps), eventQuery, setEventResponse)(Detail);
