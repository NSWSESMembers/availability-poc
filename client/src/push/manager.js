import _ from 'lodash';
import initDummy from './dummy';

// this lib is designed to be an abstraction over our push services

class PushManager {
  constructor() {
    this.services = {};
    this.hasAllTokens = false;
    this.tokens = {};
    this.waitForInit = new Promise((resolve) => {
      this.resolveWaitForInit = resolve;
    });
  }

  // call this as soon as the app wakes up so we can check for and process any notifications
  // that might have been the cause of the app being launched. This might (and probably should)
  // happen before register is called
  async init() {
    const promises = [];

    this.services.dummy = await initDummy(this);

    _.forEach(this.services, (s) => {
      promises.push(s.init());
    });

    await Promise.all(promises);

    // unblock register
    this.resolveWaitForInit();
  }

  // services should call this to indicate they have a new token. We'll store it and then call
  // the onTokenUpdate handler so the server can receive the new token
  updateToken(service, token) {
    console.log(`Got token for service ${service}: ${token}`);
    this.tokens[service] = token;
    if (this.hasAllTokens) {
      this.onTokenUpdate(this.tokens);
    }
  }

  // call this to request permission from the user (if required) and register this device with the
  // appropriate push service
  // it returns a promise that resolves when all of the registered services have attempted to get
  // a push token and the push token update callback has been called
  async register({ onTokenUpdate }) {
    // wait until init is finished before we attempt to register because we won't have determined
    // which services to use yet
    await this.waitForInit;

    const results = {};
    const promises = [];
    this.onTokenUpdate = onTokenUpdate;

    _.forEach(this.services, (s, name) => {
      promises.push(s.register().then((token) => {
        results[name] = token;
      }));
    });

    await Promise.all(promises);

    this.onTokenUpdate(this.tokens);
    this.hasAllTokens = true;
  }

  // call this to prevent further notifications from being received/processed.
  // NOTE: it does not invalidate the push token - the caller is responsible for ensuring the
  // token is invalidated on the server side.
  async deregister() {
    const promises = [];

    _.forEach(this.services, (s) => {
      promises.push(s.deregister());
    });

    await Promise.all(promises);
    this.services = null;
  }

  static didReceiveNotification(service, notification) {
    console.log(`Received notification from ${service}: `);
    console.log(notification);
  }
}

export default PushManager;
