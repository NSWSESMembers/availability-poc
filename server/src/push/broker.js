import { sendPush as apns } from './apns';
import { sendPush as fcm } from './fcm';

const sendPush = ({ devices, message }) => {
  devices.forEach((device) => {
    const promises = [];

    if (device.pushToken) {
      try {
        const pushTokens = JSON.parse(device.pushToken);
        if (pushTokens.apns) {
          promises.push(
            apns({
              token: pushTokens.apns,
              message,
            }),
          );
        }
        if (pushTokens.fcm) {
          promises.push(
            fcm({
              token: pushTokens.fcm,
              message,
            }),
          );
        }
      } catch (e) {
        console.log('Could not push to device: ', device, e);
      }
    }

    if (promises.length === 0) {
      return false;
    }

    return Promise.all(promises).then(() => true);
  });
};

// eslint-disable-next-line import/prefer-default-export
export { sendPush };
