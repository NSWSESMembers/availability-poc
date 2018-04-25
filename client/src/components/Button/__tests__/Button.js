import React from 'react';
import renderer from 'react-test-renderer';

import { Button } from '../';

const noop = () => {};

test('renders correctly', () => {
  const tree1 = renderer.create(
    <Button
      text="text"
      onPress={noop}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = renderer.create(
    <Button
      type="secondary"
      text="text"
      onPress={noop}
      disabled
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();
});
