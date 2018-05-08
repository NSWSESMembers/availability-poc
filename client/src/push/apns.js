import { NativeModules, PushNotificationIOS } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const { log } = console;

class APNSClient {
  constructor(pushManager) {
    this.pushManager = pushManager;
    this.gotToken = null;
    this.failedToGetToken = null;
  }

  serviceName = 'apns';

  async init() {
    PushNotificationIOS.addEventListener('notification', this.receivedNotification);
    PushNotificationIOS.addEventListener('localNotification', this.receivedLocalNotification);
  }

  async register() {
    PushNotificationIOS.addEventListener('register', this.didRegister);
    PushNotificationIOS.addEventListener('registrationError', this.registrationFailed);

    const result = await PushNotificationIOS.requestPermissions();
    log('Result from requesting push permissions: ', result);

    // TODO: dont try to get a token if we don't get permission

    // block until we get a push token
    await new Promise((resolve, reject) => {
      this.gotToken = resolve;
      this.failedToGetToken = reject;
    });
  }

  async deregister() {
    PushNotificationIOS.removeEventListener('register', this.didRegister);
    PushNotificationIOS.removeEventListener('registrationError', this.registrationFailed);
  }

  receivedNotification = (notification) => {
    log('Notification received: ', notification);
  }

  receivedLocalNotification = (notification) => {
    log('Local notification received: ', notification);
  }

  didRegister = (token) => {
    log('Registered for push: ', token);
    this.pushManager.updateToken(this.serviceName, token);
    this.gotToken(token);
  }

  registrationFailed = ({ message, code, details }) => {
    this.failedToGetToken(new Error('Failed to register for push: ', message, code, details));
  }
}

const init = (pushManager) => {
  // APNS doesn't work in the simulator
  const isSimulator = DeviceInfo.isEmulator();

  // if this native module is missing then the shell build is missing push notifications
  const hasNativeModule = typeof NativeModules.PushNotificationManager !== 'undefined';
  if (hasNativeModule && !isSimulator) {
    return new APNSClient(pushManager);
  }
  return null;
};

export default init;
