import React from 'react';
import TestRenderer from 'react-test-renderer';

import Profile from '../Profile';

const user = {
  username: 'username',
  email: 'email',
  displayName: 'displayName',
};

test('renders correctly', () => {
  const tree1 = TestRenderer.create(
    <Profile
      loading
      onChangeName={jest.fn()}
      user={user}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = TestRenderer.create(
    <Profile
      onChangeName={jest.fn()}
      user={user}
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();
});

test('prompt', () => {
  const handleChangeName = jest.fn();
  const newName = 'test';

  const renderer = TestRenderer.create(
    <Profile
      onChangeName={handleChangeName}
      user={user}
    />,
  );

  const profile = renderer.getInstance();

  profile.openPrompt();
  profile.closePrompt();
  profile.updateDisplayName(newName);

  expect(handleChangeName.mock.calls.length).toBe(1);
  expect(handleChangeName.mock.calls[0][0]).toEqual(newName);
});
