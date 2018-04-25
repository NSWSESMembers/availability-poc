import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import Footer from '../Center';

test('renders correctly', () => {
  const tree1 = renderer.create(
    <Footer>
      <Text>test</Text>
    </Footer>,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});
