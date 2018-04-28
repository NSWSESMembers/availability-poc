import React from 'react';
import renderer from 'react-test-renderer';

import Segment from '../Segment';

const noop = () => {};

test('renders correctly', () => {
  const tree = renderer.create(
    <Segment
      values={['one', 'two', 'three']}
      selectedIndex={1}
      handleIndexChange={noop}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
