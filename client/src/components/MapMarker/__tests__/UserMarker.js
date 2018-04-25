import React from 'react';
import renderer from 'react-test-renderer';

import UserMarker from '../UserMarker';

test('renders correctly', () => {
  const tree1 = renderer.create(
    <UserMarker
      name="name"
      status="status"
      destination="destination"
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});
