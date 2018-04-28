import React from 'react';
import renderer from 'react-test-renderer';

import UserListItem from '../UserListItem';

const noop = () => {};

test('renders correctly', () => {
  const user = {
    username: 'Name',
    displayName: 'Display Name',
  };
  const tree = renderer.create(
    <UserListItem
      user={user}
      onPress={noop}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
