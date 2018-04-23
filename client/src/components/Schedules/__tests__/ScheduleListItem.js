import React from 'react';
import renderer from 'react-test-renderer';

import ScheduleListItem from '../ScheduleListItem';

const noop = () => {};

test('renders correctly', () => {
  const schedule = {
    id: 1,
    name: 'Name',
    details: 'Details',
    startTime: 1524460714,
    endTime: 1524460714 + (60 * 60 * 24),
  };
  const tree = renderer.create(
    <ScheduleListItem
      schedule={schedule}
      onPress={noop}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
