import React from 'react';
import renderer from 'react-test-renderer';

import Input from '../Input';

const noop = () => {};

test('renders correctly', () => {
  const tree1 = renderer.create(
    <Input
      type="username"
      title="title"
      value="value"
      placeholder="placeholder"
      onChangeText={noop}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = renderer.create(
    <Input
      type="email"
      title="title"
      value="value"
      placeholder="placeholder"
      onChangeText={noop}
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();

  const tree3 = renderer.create(
    <Input
      type="password"
      title="title"
      value="value"
      placeholder="placeholder"
      onChangeText={noop}
    />,
  ).toJSON();
  expect(tree3).toMatchSnapshot();

  const tree4 = renderer.create(
    <Input
      type="unknown"
      title="title"
      value="value"
      placeholder="placeholder"
      onChangeText={noop}
    />,
  ).toJSON();
  expect(tree4).toMatchSnapshot();
});
