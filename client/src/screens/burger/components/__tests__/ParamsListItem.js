import React from 'react';
import Renderer from 'react-test-renderer';
import { Clipboard } from 'react-native';
import { ListItem } from '../../../../components/List';

import ParamsListItem from '../ParamsListItem';

const noop = () => {};

test('renders correctly', () => {
  const tree = Renderer.create(
    <ParamsListItem
      title="title"
      detail="detail"
      onPress={noop}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('onPress', () => {
  const detail = 'detail';

  // mock the setString function
  Clipboard.setString = jest.fn();

  const renderer = Renderer.create(
    <ParamsListItem
      title="title"
      detail={detail}
      onPress={noop}
    />,
  );

  renderer.root.findByType(ListItem).props.onPress();

  expect(Clipboard.setString.mock.calls.length).toBe(1);
  expect(Clipboard.setString.mock.calls[0][0]).toBe(detail);
});
