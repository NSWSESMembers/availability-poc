import React from 'react';
import renderer from 'react-test-renderer';

import { Alert } from '../';

test('renders correctly', () => {
  const tree1 = renderer.create(
    <Alert
      status="status"
      title="title"
      message="message"
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = renderer.create(
    <Alert
      status="success"
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();
});
