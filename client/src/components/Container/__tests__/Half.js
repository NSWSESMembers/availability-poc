import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import Half from '../Half';

test('renders correctly', () => {
  const tree1 = renderer.create(
    <Half>
      <Text>test</Text>
    </Half>,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});
