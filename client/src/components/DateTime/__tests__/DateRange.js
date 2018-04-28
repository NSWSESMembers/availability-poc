import React from 'react';
import renderer from 'react-test-renderer';

import DateRange from '../DateRange';

const noop = () => {};

const testData = {
  startTime: 1,
  endTime: 2,
  id: 1,
  status: 'NOT_SPECIFIED',
};

test('renders correctly', () => {
  const tree = renderer.create(
    <DateRange
      startTime={1}
      endTime={3}
      onSelect={noop}
      selectedDays={[2]}
      timeSegments={[testData]}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
