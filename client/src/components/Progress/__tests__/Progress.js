import React from 'react';
import renderer from 'react-test-renderer';

import Progress from '../Progress';

test('renders correctly', () => {
  const tree1 = renderer.create(
    <Progress />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});
