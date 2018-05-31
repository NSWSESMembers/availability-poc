class DummyClient {
  constructor(pushManager) {
    this.pushManager = pushManager;
  }

  // eslint-disable-next-line class-methods-use-this
  init() {
    return Promise.resolve();
  }

  // return a promise that resolves when we have called updateToken on the push manager at least
  // once
  register() {
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    // simulate an async token update
    setTimeout(() => {
      this.pushManager.updateToken('dummy', 'DUMMY_TOKEN2');
    }, 1000 * 20);

    return promise.then(() => {
      this.pushManager.updateToken('dummy', 'DUMMY_TOKEN1');
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async deregister() {
    // not really needed for dummy implementation
  }
}

const init = (pushManager) => {
  const promise = new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return promise.then(() => Promise.resolve(new DummyClient(pushManager)));
};

export default init;
