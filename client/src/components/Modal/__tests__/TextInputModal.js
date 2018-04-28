import React from 'react';
import renderer from 'react-test-renderer';

import TextInputModal from '../TextInputModal';

const noop = () => {};

test('renders correctly', () => {
  const tree1 = renderer.create(
    <TextInputModal
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
