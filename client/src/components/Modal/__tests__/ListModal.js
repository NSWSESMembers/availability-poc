import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import ListModal from '../ListModal';

const noop = () => {};

test('renders correctly', () => {
  const tree1 = renderer.create(
    <ListModal
      title="test"
      data={[<Text>test</Text>]}
      closeModal={noop}
      backModal={noop}
      onChange={noop}
      visible
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});
