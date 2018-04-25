import React from 'react';
import renderer from 'react-test-renderer';

import ButtonRow from '../ButtonRow';

const noop = () => {};

test('renders correctly', () => {
  const tree1 = renderer.create(
    <ButtonRow
      title="title"
      description="description"
      onPress={noop}
      showIcon
      showIconNoPress
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = renderer.create(
    <ButtonRow
      title="title"
      description="description"
      showIcon
      showIconNoPress
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();
});
