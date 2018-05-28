import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import Modal from '../Modal';

const noop = () => {};

const child = <Text>child</Text>;

test('renders correctly', () => {
  const tree1 = renderer
    .create(
      <Modal closeModal={noop} visible>
        {child}
      </Modal>,
    )
    .toJSON();
  expect(tree1).toMatchSnapshot();
});
