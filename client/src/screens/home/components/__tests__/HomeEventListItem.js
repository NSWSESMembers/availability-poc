import React from 'react';
import TestRenderer from 'react-test-renderer';

import HomeEventListItem from '../HomeEventListItem';

const event = {
  id: 1,
  name: 'name',
  details: 'details',
};

test('renders correctly', () => {
  const tree1 = TestRenderer.create(
    <HomeEventListItem
      event={event}
      onPress={jest.fn()}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree = TestRenderer.create(
    <HomeEventListItem
      event={event}
      onPress={jest.fn()}
      urgent
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('onPress', () => {
  const mockOnPress = jest.fn();

  const renderer = TestRenderer.create(
    <HomeEventListItem
      event={event}
      onPress={mockOnPress}
    />,
  );

  renderer.getInstance().handlePress();

  expect(mockOnPress.mock.calls.length).toBe(1);
  expect(mockOnPress.mock.calls[0][0]).toBe(event);
});
