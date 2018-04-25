import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import Container from '../Container';

test('renders correctly', () => {
  const tree1 = renderer.create(
    <Container>
      <Text>test</Text>
    </Container>,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = renderer.create(
    <Container isAlt>
      <Text>test</Text>
    </Container>,
  ).toJSON();
  expect(tree2).toMatchSnapshot();
});
