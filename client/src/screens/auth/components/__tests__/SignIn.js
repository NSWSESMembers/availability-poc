import React from 'react';
import TestRenderer from 'react-test-renderer';

import SignIn from '../SignIn';


test('renders correctly', () => {
  const onSignIn = jest.fn();
  const tree1 = TestRenderer.create(
    <SignIn
      onSignIn={onSignIn}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = TestRenderer.create(
    <SignIn
      onSignIn={onSignIn}
      loading
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();
});

test('events', () => {
  const username = 'username';
  const password = 'password';
  const onSignIn = jest.fn();
  const renderer = TestRenderer.create(
    <SignIn
      onSignIn={onSignIn}
      loading={false}
    />,
  );

  const signIn = renderer.getInstance();
  signIn.onChangeUsername(username);
  signIn.onChangePassword(password);
  signIn.onSignIn();

  expect(onSignIn.mock.calls.length).toBe(1);
  expect(onSignIn.mock.calls[0][0]).toEqual({ username, password });
});
