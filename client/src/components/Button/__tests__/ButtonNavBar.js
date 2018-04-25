import React from 'react';
import renderer from 'react-test-renderer';

import ButtonNavBar from '../ButtonNavBar';

const noop = () => {};

test('renders correctly', () => {
  const tree1 = renderer.create(
    <ButtonNavBar
      icon="glass"
      onPress={noop}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});
