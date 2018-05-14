import React from 'react';
import renderer from 'react-test-renderer';

import MyLocationMarker from '../MyLocationMarker';

const valid = {
  latitude: 1,
  longitude: 1,
  heading: 1,
};

const noHeading = {
  latitude: 1,
  longitude: 1,
};

test('renders correctly', () => {
  const tree1 = renderer.create(
    <MyLocationMarker
      myPosition={valid}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = renderer.create(
    <MyLocationMarker />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();

  const tree3 = renderer.create(
    <MyLocationMarker
      myPosition={noHeading}
    />,
  ).toJSON();
  expect(tree3).toMatchSnapshot();
});
