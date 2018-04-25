import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import Holder from '../Holder';

test('renders correctly', () => {
  const tree1 = renderer.create(
    <Holder>
      <Text>test</Text>
    </Holder>,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = renderer.create(
    <Holder
      paddingVertical
      marginVertical
      marginTop
      margin
      wide
      marginBot
      transparent
    >
      <Text>test</Text>
    </Holder>,
  ).toJSON();
  expect(tree2).toMatchSnapshot();
});
