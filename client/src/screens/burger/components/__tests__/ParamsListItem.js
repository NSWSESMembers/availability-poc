import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Clipboard } from 'react-native';
import { ListItem } from '../../../../components/List';

import ParamsListItem from '../ParamsListItem';

test('renders correctly', () => {
  const tree = TestRenderer.create(
    <ParamsListItem
      title="title"
      detail="detail"
      onPress={jest.fn()}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('onPress', () => {
  const detail = 'detail';

  // mock the setString function
  Clipboard.setString = jest.fn();

  const renderer = TestRenderer.create(
    <ParamsListItem
      title="title"
      detail={detail}
      onPress={jest.fn()}
    />,
  );

  renderer.root.findByType(ListItem).props.onPress();

  expect(Clipboard.setString.mock.calls.length).toBe(1);
  expect(Clipboard.setString.mock.calls[0][0]).toBe(detail);
});
