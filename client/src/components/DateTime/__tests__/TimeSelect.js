import React from 'react';
import renderer from 'react-test-renderer';

import TimeSelect from '../TimeSelect';

const noop = () => {};

const testData = {
  startTime: 1,
  endTime: 2,
  label: 'test',
};

test('renders correctly', () => {
  const tree = renderer.create(
    <TimeSelect
      selectionSegments={[testData]}
      onPress={noop}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
