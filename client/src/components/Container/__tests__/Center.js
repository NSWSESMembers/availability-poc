import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import Center from '../Center';

test('renders correctly', () => {
  const tree1 = renderer.create(
    <Center>
      <Text>test</Text>
    </Center>,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});
