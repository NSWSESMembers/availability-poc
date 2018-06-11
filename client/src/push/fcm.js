// PUSH PROVIDER for FCM (Firebase Cloud Messaging)

import { NativeModules } from 'react-native';
// we import react-native-firebase dynamically

class FCMClient {
  constructor(firebase, pushManager) {
    this.FCM = firebase.messaging();
    this.FCN = firebase.notifications();
    this.pushManager = pushManager;
  }

  serviceName = 'fcm';

  async init() {
    // set up the notification handlers and handle any pending notifications
    const self = this;

    self.onNotificationOpened = this.FCN.onNotificationOpened((notification) => {
      // Listen for a Notification getting opened if we are in the background
      // eg, tap from notification bar
      this.pushManager.onNotificationOpened(notification);
    });

    self.notificationListener = this.FCN.onNotification((notification) => {
      // Listen for a Notification if we are in the foreground
      this.pushManager.onNotification(notification);
    });
  }

  async register() {
    // the FCM token might change over time so we register here for updates and push them through
    // to the pushManager
    this.refreshTokenListener = this.FCM.onTokenRefresh((token) => {
      this.didRegister(token);
    });

    // here we return a Promise that fulfills once the token becomes available but we're still
    // responsible for sending it through to the pushManager
    this.FCM.getToken().then((token) => {
      this.didRegister(token);
    });

    // block until we get a push token
    await new Promise((resolve, reject) => {
      this.gotToken = resolve;
      this.failedToGetToken = reject;
    });
  }

  didRegister = (token) => {
    console.log('Registered for push: ', token);
    this.pushManager.updateToken(this.serviceName, token);
    this.gotToken(token);
  };

  // eslint-disable-next-line
  clear() {
    // NYI: here we stop accepting push notifications and unsubscribe ourselves from callbacks

    // if (this.notificationListener) {
    //   this.notificationListener.remove();
    // }
  }

  async deregister() {
    // here we tell firebase we don't care about further updates to the push token
    if (this.refreshTokenListener) {
      this.refreshTokenListener = null;
    }
  }
}

const init = (pushManager) => {
  // this is a demand import - we need to make sure this doesn't get executed on devices that
  // don't have the firebase native module compiled in
  if (typeof NativeModules.RNFirebase === 'undefined') {
    return Promise.resolve(null);
  }

  return import('react-native-firebase').then(({ default: firebase }) => (
    new FCMClient(firebase, pushManager)
  ));
};

export default init;
