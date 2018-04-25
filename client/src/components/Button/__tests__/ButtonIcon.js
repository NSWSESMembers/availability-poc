import React from 'react';
import renderer from 'react-test-renderer';

import ButtonIcon from '../ButtonIcon';

const noop = () => {};

test('renders correctly', () => {
  const tree1 = renderer.create(
    <ButtonIcon
      text="text"
      icon="glass"
      onPress={noop}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = renderer.create(
    <ButtonIcon
      text="text"
      icon="glass"
      backgroundColor="red"
      onPress={noop}
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();
});
