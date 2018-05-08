import { sendPush as apns } from './apns';

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
      } catch (e) {
        console.log('Could not push to device: ', device);
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
