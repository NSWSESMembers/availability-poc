import React from 'react';
import TestRenderer from 'react-test-renderer';

import HomeScheduleListItem from '../HomeScheduleListItem';

const schedule = {
  id: 1,
  name: 'name',
  details: 'details',
  group: {
    name: 'group',
  },
  startTime: 1524460714,
  endTime: 1524460714 + (60 * 60 * 24),
};

test('renders correctly', () => {
  const tree1 = TestRenderer.create(
    <HomeScheduleListItem
      schedule={schedule}
      onPress={jest.fn()}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});

test('onPress', () => {
  const mockOnPress = jest.fn();

  const renderer = TestRenderer.create(
    <HomeScheduleListItem
      schedule={schedule}
      onPress={mockOnPress}
    />,
  );

  renderer.getInstance().handlePress();

  expect(mockOnPress.mock.calls.length).toBe(1);
  expect(mockOnPress.mock.calls[0][0]).toBe(schedule);
});
