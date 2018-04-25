import React from 'react';
import TestRenderer from 'react-test-renderer';

import PushHandler from '../PushHandler';

class MockPushManager {
  // eslint-disable-next-line class-methods-use-this
  async register({ onTokenUpdate }) {
    this.registerPromise = new Promise((resolve) => {
      setTimeout(() => {
        onTokenUpdate({ test: 'TEST_TOKEN' });
        resolve();
      }, 500);
    });
    return this.registerPromise;
  }

  // eslint-disable-next-line class-methods-use-this
  async deregister() {
    // so we can unmount
  }
}

test('lifecycle', (done) => {
  const pushManager = new MockPushManager();

  const failIfCalled = () => {
    done.fail(new Error('updateToken should not be called'));
  };

  // this should not call updateToken because there is no auth nor device
  const renderer = TestRenderer.create(
    <PushHandler
      pushManager={pushManager}
      updateToken={failIfCalled}
      auth={{}}
    />,
  );

  // this should not call updateToken because there is no device
  renderer.update(
    <PushHandler
      pushManager={pushManager}
      updateToken={failIfCalled}
      auth={{ username: 'test' }}
    />,
  );

  // this should not call updateToken because there is no auth
  renderer.update(
    <PushHandler
      pushManager={pushManager}
      updateToken={failIfCalled}
      auth={{}}
      device={{ pushToken: '' }}
    />,
  );

  const updateToken = async (tokens) => {
    expect(tokens).toEqual({ token: '{"test":"TEST_TOKEN"}' });
    done();
  };

  // this should call updateToken
  renderer.update(
    <PushHandler
      pushManager={pushManager}
      updateToken={updateToken}
      auth={{ username: 'test' }}
      device={{ pushToken: '' }}
    />,
  );
});

test('everything pre-loaded', async () => {
  const pushManager = new MockPushManager();
  let didUpdateTokens = false;

  const updateToken = async (tokens) => {
    expect(tokens).toEqual({ token: '{"test":"TEST_TOKEN"}' });
    didUpdateTokens = true;
  };

  // this should call updateToken
  const renderer = TestRenderer.create(
    <PushHandler
      pushManager={pushManager}
      updateToken={updateToken}
      auth={{ username: 'test' }}
      device={{ pushToken: '' }}
    />,
  );

  await pushManager.registerPromise;
  await renderer.root.updatePromise;
  expect(didUpdateTokens).toBe(true);
});

test('no change', async (done) => {
  const pushManager = new MockPushManager();

  const updateToken = async () => {
    done.fail(new Error('Should be no need to update the server'));
  };

  // this should call updateToken
  const renderer = TestRenderer.create(
    <PushHandler
      pushManager={pushManager}
      updateToken={updateToken}
      auth={{ username: 'test' }}
      device={{ pushToken: '{"test":"TEST_TOKEN"}' }}
    />,
  );

  await pushManager.registerPromise;
  await renderer.root.updatePromise;
  done();
});

test('token update fail', (done) => {
  const pushManager = new MockPushManager();

  const updateToken = async () => {
    console.log('we did finish');
    done();
    throw new Error('fail');
  };

  // this should call updateToken
  const renderer = TestRenderer.create(
    <PushHandler
      pushManager={pushManager}
      updateToken={updateToken}
      auth={{ username: 'test' }}
      device={{ pushToken: '' }}
    />,
  );

  pushManager.registerPromise.then(() => {
    renderer.root.updatePromise.then(() => {
      done();
    });
  });
});

test('unmount', () => {
  const pushManager = new MockPushManager();

  const noop = async () => {};

  // this should call updateToken
  const renderer = TestRenderer.create(
    <PushHandler
      pushManager={pushManager}
      updateToken={noop}
      auth={{}}
    />,
  );
  renderer.unmount();
});
