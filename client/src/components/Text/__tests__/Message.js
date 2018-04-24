import React from 'react';
import renderer from 'react-test-renderer';

import { Message } from '../';

test('renders correctly', () => {
  const tree = renderer.create(
    <Message>Test</Message>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
