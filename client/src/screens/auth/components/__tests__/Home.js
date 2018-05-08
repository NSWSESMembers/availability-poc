import React from 'react';
import TestRenderer from 'react-test-renderer';

import Home from '../Home';

test('renders correctly', () => {
  const noop = jest.fn();
  const tree1 = TestRenderer.create(
    <Home
      version="version"
      codePushHash="codePushHash"
      onPressSignIn={noop}
      onPressRegister={noop}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});
