import { Alert } from 'react-native';

class FCMClient {
  constructor(firebase, pushManager) {
    this.FCM = firebase.messaging();
    this.FCN = firebase.notifications();
    this.pushManager = pushManager;
  }

  serviceName = 'fcm';

  init() {
    // set up the notification handlers and handle any pending notifications
    const self = this;

    self.notificationListener = this.FCN.onNotificationOpened((notification) => {
      Alert.alert(
        notification.fcm.title,
        notification.fcm.body,
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );

      if (notification.local_notification) {
        // this is a local notification
        return;
      }
      if (notification.opened_from_tray) {
        // app is open/resumed because user clicked banner
        // execute preregistered action associated with notification if exists
        if (notification.aps &&
            notification.aps.category &&
            this.actions[notification.aps.category]) {
          this.actions[notification.aps.category](notification);
        }
      }
    });

    this.FCN.getInitialNotification().then((notificationOpen) => {
      if (notificationOpen) {
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        // Get information about the notification that was opened
        const { action, notification } = notificationOpen;
      }
    });
  }

  register() {
    const self = this;

    // the FCM token might change over time so we register here for updates and push them through
    // to the pushManager
    this.refreshTokenListener = this.FCM.onTokenRefresh((token) => {
      self.token = token;
      self.pushManager.updateToken(self.serviceName, token);
    });

    // here we return a Promise that fulfills once the token becomes available but we're still
    // responsible for sending it through to the pushManager
    return this.FCM.getToken().then((token) => {
      self.token = token;
      self.pushManager.updateToken(self.serviceName, token);
    });
  }

  clear() {
    // NYI: here we stop accepting push notifications and unsubscribe ourselves from callbacks

    // if (this.notificationListener) {
    //   this.notificationListener.remove();
    // }
  }

  deregister() {
    // here we tell firebase we don't care about further updates to the push token
    if (this.refreshTokenListener) {
      this.refreshTokenListener.remove();
    }
  }
}

const init = (pushManager) => {
  // this is a demand import - we need to make sure this doesn't get executed on devices that
  // don't have the firebase native module compiled in
  const firebase = import('react-native-firebase');
  return new FCMClient(firebase, pushManager);
};

export default init;
