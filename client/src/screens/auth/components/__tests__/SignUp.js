import React from 'react';
import TestRenderer from 'react-test-renderer';

import SignUp from '../SignUp';


test('renders correctly', () => {
  const onSignUp = jest.fn();
  const tree1 = TestRenderer.create(
    <SignUp
      onSignUp={onSignUp}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = TestRenderer.create(
    <SignUp
      onSignUp={onSignUp}
      loading
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();
});

test('events', () => {
  const username = 'username';
  const password = 'password';
  const email = 'email';
  const onSignUp = jest.fn();
  const renderer = TestRenderer.create(
    <SignUp
      onSignUp={onSignUp}
      loading={false}
    />,
  );

  const signUp = renderer.getInstance();
  signUp.onChangeUsername(username);
  signUp.onChangePassword(password);
  signUp.onChangeEmail(email);
  signUp.onSignUp();

  expect(onSignUp.mock.calls.length).toBe(1);
  expect(onSignUp.mock.calls[0][0]).toEqual({ username, email, password });
});
