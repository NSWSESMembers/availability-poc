import React from 'react';
import renderer from 'react-test-renderer';

import AccuracyHalo from '../AccuracyHalo';

const valid = {
  latitude: 1,
  longitude: 1,
  accuracy: 1,
};

test('renders correctly', () => {
  const tree1 = renderer.create(
    <AccuracyHalo
      myPosition={valid}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = renderer.create(
    <AccuracyHalo />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();
});
