import React from 'react';
import TestRenderer from 'react-test-renderer';
import DeviceInfo from 'react-native-device-info';

import PushHandler from '../PushHandler';

const testDeviceName = 'test device';
DeviceInfo.getDeviceName = jest.fn(() => testDeviceName);

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

test('lifecycle', async (done) => {
  const pushManager = new MockPushManager();

  const failIfCalled = jest.fn(async () => {
    done.fail(new Error('updateDevice should not be called'));
  });

  // this should not call updateDevice because there is no auth nor device
  const renderer = TestRenderer.create(
    <PushHandler
      pushManager={pushManager}
      updateDevice={failIfCalled}
      auth={{}}
    />,
  );

  // this should not call updateDevice because there is no device
  renderer.update(
    <PushHandler
      pushManager={pushManager}
      updateDevice={failIfCalled}
      auth={{ username: 'test' }}
    />,
  );

  // this should not call updateDevice because there is no auth
  renderer.update(
    <PushHandler
      pushManager={pushManager}
      updateDevice={failIfCalled}
      auth={{}}
      device={{ pushToken: '' }}
    />,
  );

  expect(failIfCalled.mock.calls.length).toBe(0);

  const updateDevice = jest.fn(async () => {});

  // this should call updateDevice
  renderer.update(
    <PushHandler
      pushManager={pushManager}
      updateDevice={updateDevice}
      auth={{ username: 'test' }}
      device={{ pushToken: '' }}
    />,
  );

  await pushManager.registerPromise;
  await renderer.root.updatePromise;

  expect(updateDevice.mock.calls[0][0]).toEqual(
    { token: '{"test":"TEST_TOKEN"}', name: testDeviceName },
  );

  done();
});

test('everything pre-loaded', async () => {
  const pushManager = new MockPushManager();

  const updateDevice = jest.fn(async () => {});

  // this should call updateDevice
  const renderer = TestRenderer.create(
    <PushHandler
      pushManager={pushManager}
      updateDevice={updateDevice}
      auth={{ username: 'test' }}
      device={{ pushToken: '' }}
    />,
  );

  await pushManager.registerPromise;
  await renderer.root.updatePromise;
  expect(updateDevice.mock.calls.length).toBe(1);
  expect(updateDevice.mock.calls[0][0]).toEqual(
    { token: '{"test":"TEST_TOKEN"}', name: testDeviceName },
  );
});

test('no change', async (done) => {
  const pushManager = new MockPushManager();

  const updateDevice = jest.fn(async () => {});

  // this should call updateDevice
  const renderer = TestRenderer.create(
    <PushHandler
      pushManager={pushManager}
      updateDevice={updateDevice}
      auth={{ username: 'test' }}
      device={{ pushToken: '{"test":"TEST_TOKEN"}' }}
    />,
  );

  await pushManager.registerPromise;
  await renderer.root.updatePromise;
  expect(updateDevice.mock.calls.length).toBe(0);
  done();
});

test('token update fail', async (done) => {
  const pushManager = new MockPushManager();

  const updateDevice = jest.fn(async () => {
    done();
    throw new Error('fail');
  });

  // this should call updateDevice
  const renderer = TestRenderer.create(
    <PushHandler
      pushManager={pushManager}
      updateDevice={updateDevice}
      auth={{ username: 'test' }}
      device={{ pushToken: '' }}
    />,
  );

  await pushManager.registerPromise;
  await renderer.root.updatePromise;
  expect(updateDevice.mock.calls.length).toBe(1);
});

test('unmount', () => {
  const pushManager = new MockPushManager();

  const noop = jest.fn();

  const renderer = TestRenderer.create(
    <PushHandler
      pushManager={pushManager}
      updateDevice={noop}
      auth={{}}
    />,
  );
  renderer.unmount();
});
