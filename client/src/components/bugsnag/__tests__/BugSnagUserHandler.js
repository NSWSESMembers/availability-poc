import React from 'react';
import TestRenderer from 'react-test-renderer';
import BugSnagUserHandler from '../BugSnagUserHandler';

test('lifecycle', async () => {
  const bugsnag = {
    setUser(id, username, email) {
      this.id = id;
      this.username = username;
      this.email = email;
    },
  };

  const failIfCalled = jest.fn();


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

  expect(failIfCalled.mock.calls.length).toBe(0);

  // this should call setUser
  renderer.update(
    <BugSnagUserHandler
      bugsnag={bugsnag}
      auth={{ id: 1, username: 'test' }}
    />,
  );

  await renderer.root.updatePromise;


  expect(bugsnag.username).toEqual('test');
  expect(bugsnag.id).toEqual('1');
  expect(bugsnag.email).toEqual(undefined);
});

test('everything pre-loaded', async () => {
  const bugsnag = {
    setUser(id, username, email) {
      this.id = id;
      this.username = username;
      this.email = email;
    },
  };


  // this should call setUser
  const renderer = TestRenderer.create(
    <BugSnagUserHandler
      bugsnag={bugsnag}
      auth={{ id: 1, username: 'test' }}
    />,
  );

  await renderer.root.updatePromise;


  expect(bugsnag.username).toEqual('test');
  expect(bugsnag.id).toEqual('1');
  expect(bugsnag.email).toEqual(undefined);
});
