/*
  helpers for determining lat and long deltas when given lat + long and a distance.
  will return location with deltas so the map will render at a zoom level that will
  cover the given distance
*/

// eslint-disable-next-line import/prefer-default-export
export const getMapDelta = (lat, lon, distance) => {
  const oneDegreeOfLatitudeInMeters = 111.32 * 1000;

  const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
  const longitudeDelta = distance / (oneDegreeOfLatitudeInMeters * Math.cos(lat * (Math.PI / 180)));

  return {
    latitude: lat,
    longitude: lon,
    latitudeDelta,
    longitudeDelta,
  };
};
