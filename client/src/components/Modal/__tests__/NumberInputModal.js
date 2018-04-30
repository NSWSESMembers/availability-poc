import React from 'react';
import renderer from 'react-test-renderer';

import NumberInputModal from '../NumberInputModal';

const noop = () => {};

test('renders correctly', () => {
  const tree1 = renderer.create(
    <NumberInputModal
      title="title"
      placeHolder="placeHolder"
      closeModal={noop}
      onSave={noop}
      backModal={noop}
      onChangeText={noop}
      visible
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});
