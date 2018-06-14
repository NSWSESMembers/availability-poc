import { eventLocationMapMarkers } from '../eventLocationMapMarkers';

const aMarker = [{
  name: 'markera',
  locationLatitude: 0,
  locationLongitude: 0,
  icon: 'icon',
}];

const bMarker = [{
  name: 'markerb',
  locationLatitude: 0,
  locationLongitude: 0,
  icon: 'icon',
}];

test('user marker', () => {
  expect(
    eventLocationMapMarkers(aMarker),
  ).toMatchSnapshot();
  expect(
    eventLocationMapMarkers(aMarker.concat(bMarker)),
  ).toMatchSnapshot();
});
