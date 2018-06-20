/*
  Give it an array of event response objects and it will return and array of
  react-native-maps/map-marker friendly objects (with some extra data mixed in)
*/

import moment from 'moment';

// eslint-disable-next-line import/prefer-default-export
export const userResponseMapMarkers = (filter, responses) => {
  const mapMarkers = [];
  responses.forEach((r) => {
    if (r.locationLatitude !== null && r.locationLongitude !== null && r.user.id !== filter) {
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
  });
  return mapMarkers;
};
