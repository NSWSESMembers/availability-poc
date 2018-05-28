import React from 'react';
import TestRenderer from 'react-test-renderer';
import BugSnagUserHandler from '../BugSnagUserHandler';


test('lifecycle', async () => {
  const bugsnag = {
    setUser: jest.fn(),
  };

  const failIfCalled = { setUser: jest.fn() };


  // this should/cant call setUser because there is no auth nor bugnsag
  const renderer = TestRenderer.create(
    <BugSnagUserHandler
      bugsnag={{}}
      auth={{}}
    />,
  );

  // this should/cant call setUser because there is no bugsnag
  renderer.update(
    <BugSnagUserHandler
      bugsnag={{}}
      auth={{ id: 1, username: 'test' }}
    />,
  );

  // this should not call setUser because there is no auth
  renderer.update(
    <BugSnagUserHandler
      bugsnag={failIfCalled}
      auth={{}}
    />,
  );

  expect(failIfCalled.setUser.mock.calls.length).toBe(0);

  // this should call setUser
  renderer.update(
    <BugSnagUserHandler
      bugsnag={bugsnag}
      auth={{ id: 1, username: 'test' }}
    />,
  );

  await renderer.root.updatePromise;

  expect(bugsnag.setUser.mock.calls.length).toBe(1);
  expect(bugsnag.setUser.mock.calls[0][0]).toEqual('1');
  expect(bugsnag.setUser.mock.calls[0][1]).toEqual('test');
  expect(bugsnag.setUser.mock.calls[0][2]).toEqual(undefined);
});

test('everything pre-loaded', async () => {
  const bugsnag = {
    setUser: jest.fn(),
  };


  // this should call setUser
  const renderer = TestRenderer.create(
    <BugSnagUserHandler
      bugsnag={bugsnag}
      auth={{ id: 1, username: 'test' }}
    />,
  );

  await renderer.root.updatePromise;

  expect(bugsnag.setUser.mock.calls.length).toBe(1);
  expect(bugsnag.setUser.mock.calls[0][0]).toEqual('1');
  expect(bugsnag.setUser.mock.calls[0][1]).toEqual('test');
  expect(bugsnag.setUser.mock.calls[0][2]).toEqual(undefined);
});
