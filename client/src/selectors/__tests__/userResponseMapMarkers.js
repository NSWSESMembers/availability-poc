import { userResponseMapMarkers } from '../userResponseMapMarkers';

const aUser = [{
  locationLatitude: 10,
  locationLongitude: 10,
  status: 'available',
  destination: { name: 'lhq' },
  locationTime: 1,
  user: {
    id: 1,
    username: 'usera',
    displayName: 'displayName',
  },
}];

const bUser = [{
  locationLatitude: 20,
  locationLongitude: 20,
  destination: { name: 'lhq' },
  locationTime: 1,
  status: 'available',
  user: {
    id: 2,
    username: 'userb',
    displayName: 'displayName',
  },
}];

test('user marker', () => {
  expect(
    userResponseMapMarkers(0, aUser),
  ).toMatchSnapshot();
  expect(
    userResponseMapMarkers(0, aUser.concat(bUser)),
  ).toMatchSnapshot();
});
