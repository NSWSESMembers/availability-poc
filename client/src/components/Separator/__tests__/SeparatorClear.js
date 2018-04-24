import React from 'react';
import renderer from 'react-test-renderer';

import { SeparatorClear } from '../';

test('renders correctly', () => {
  const tree = renderer.create(
    <SeparatorClear />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
