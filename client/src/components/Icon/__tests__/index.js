import React from 'react';
import renderer from 'react-test-renderer';

import Icon from '../';

test('renders correctly', () => {
  const tree1 = renderer.create(
    <Icon
      name="music"
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = renderer.create(
    <Icon
      name="fa-music"
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();
  const tree3 = renderer.create(
    <Icon
      name="mci-music"
    />,
  ).toJSON();
  expect(tree3).toMatchSnapshot();
  const tree4 = renderer.create(
    <Icon
      name="fnd-music"
    />,
  ).toJSON();
  expect(tree4).toMatchSnapshot();
  const tree5 = renderer.create(
    <Icon
      name="oi-alert"
    />,
  ).toJSON();
  expect(tree5).toMatchSnapshot();
});
