import React from 'react';
import renderer from 'react-test-renderer';

import MyLocationMapMarker from '../MyLocationMarker';

const validGPS = {
  longitude: 1,
  latitude: 1,
  heading: 0,
};

test('renders correctly', () => {
  const tree = renderer.create(
    <MyLocationMapMarker
      myPosition={validGPS}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();

  const tree2 = renderer.create(
    <MyLocationMapMarker />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();
});
