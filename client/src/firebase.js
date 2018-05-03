import {
  Alert,
} from 'react-native';
import firebase from 'react-native-firebase';

const FCM = firebase.messaging();
const FCN = firebase.notifications();


export class Firebase {
  constructor({ actions }) {
    this.actions = actions;
  }

  init() {
    const self = this;

    // already initialized
    if (self.token) {
      return Promise.resolve(self.token);
    }

    self.notificationListener = FCN.onNotificationOpened((notification) => {
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

    // fcm token may not be available on first load, catch it here
    self.refreshTokenListener = FCM.onTokenRefresh((token) => {
      self.token = token;
      return Promise.resolve(self.token);
    });

    // return device token
    return FCM.getToken().then((token) => {
      console.log('TOKEN (getFCMToken)', token);
      self.token = token;
      return token;
    });
  }

  // stop listening for notifications
  clear() {
    // if (this.notificationListener) {
    //   this.notificationListener.remove();
    // }
    //
    // if (this.refreshTokenListener) {
    //   this.refreshTokenListener.remove();
    // }

    this.token = null;
  }
}

export default Firebase;
