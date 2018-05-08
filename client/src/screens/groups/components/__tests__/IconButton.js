import React from 'react';
import renderer from 'react-test-renderer';

import IconButton from '../IconButton';

const noop = () => {};

test('renders correctly', () => {
  const tree = renderer.create(
    <IconButton
      onPress={noop}
      icon="fa-sign-out"
      text="text"
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
