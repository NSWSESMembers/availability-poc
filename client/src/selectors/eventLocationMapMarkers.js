/*
  Give it an array of event location objects and it will return and array of
  react-native-maps/map-marker friendly objects (with some extra data mixed in)
*/

// eslint-disable-next-line import/prefer-default-export
export const eventLocationMapMarkers = (eventLocations) => {
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
};
