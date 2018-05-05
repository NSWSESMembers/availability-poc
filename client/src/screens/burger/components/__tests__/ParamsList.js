import React from 'react';
import renderer from 'react-test-renderer';

import ParamsList from '../ParamsList';

test('renders correctly', () => {
  const tree = renderer.create(
    <ParamsList
      deviceInfo="deviceInfo"
      packageInfo="packageInfo"
      auth="auth"
      device="device"
      user="user"
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
