import React from 'react';
import renderer from 'react-test-renderer';

import Paper from '../Paper';

test('renders correctly', () => {
  const tree1 = renderer.create(
    <Paper
      title="title"
      text="text"
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});
