import React from 'react';
import renderer from 'react-test-renderer';

import { ButtonBox } from '../';
import Colors from '../../../themes/Colors';

const noop = () => {};

test('renders correctly', () => {
  const tree1 = renderer.create(
    <ButtonBox
      text="text"
      subtext="subtext"
      onPress={noop}
      disabled
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = renderer.create(
    <ButtonBox
      text="text"
      subtext="subtext"
      onPress={noop}
      selected
      selectedColor={Colors.bgBtnAvailable}
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();

  const tree3 = renderer.create(
    <ButtonBox
      text="text"
      onPress={noop}
      selectedColor={Colors.bgBtnUnavailable}
    />,
  ).toJSON();
  expect(tree3).toMatchSnapshot();

  const tree4 = renderer.create(
    <ButtonBox
      text="text"
      onPress={noop}
      selectedColor={Colors.bgBtnUrgent}
    />,
  ).toJSON();
  expect(tree4).toMatchSnapshot();
});
