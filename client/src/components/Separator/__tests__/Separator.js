import React from 'react';
import renderer from 'react-test-renderer';

import { Separator } from '../';

test('renders correctly', () => {
  const tree = renderer.create(
    <Separator />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
