import fetch from 'node-fetch';

const FIREBASE_SERVER_KEY = 'AIzaSyBNjq8QTFCVLRYs9EyXa5UZjmJdSEPFxjA';

const FIREBASE_ROOT_URL = 'https://fcm.googleapis.com/fcm';

export const sendNotification = (notification) => {
  fetch(`${FIREBASE_ROOT_URL}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${FIREBASE_SERVER_KEY}`,
    },
    body: JSON.stringify(notification),
  })
    .then(res => res.json()).then((json) => {
      console.log(json); // eslint-disable-line no-console
    })
    .catch((e) => {
      console.log(e); // eslint-disable-line no-console
    });
};

export default sendNotification;
