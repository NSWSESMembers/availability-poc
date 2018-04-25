import React from 'react';
import renderer from 'react-test-renderer';

import ButtonRowPicker from '../ButtonRowPicker';

const noop = () => {};

test('renders correctly', () => {
  const tree1 = renderer.create(
    <ButtonRowPicker
      title="title"
      onSelect={noop}
      selected="selected"
      showIcon
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});

test('calls onConfirm', () => {
  let node;
  const component = renderer.create(
    <ButtonRowPicker
      title="title"
      onSelect={noop}
      selected="selected"
      showIcon
      ref={(ref) => { node = ref; }}
    />,
  );
  node.onConfirm({ label: 'label' });
  expect(component.toJSON()).toMatchSnapshot();
});
