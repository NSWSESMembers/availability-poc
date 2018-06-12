import * as admin from 'firebase-admin';

const makeCert = () => {
  const cert = [
    '-----BEGIN PRIVATE KEY-----\n',
    process.env.FBA_KEY,
    '\n-----END PRIVATE KEY-----',
  ];
  return cert.join('');
};

const options = {
  type: 'service_account',
  project_id: 'callout-bce1b',
  private_key_id: process.env.FBA_KEY_ID,
  private_key: makeCert(),
  client_email: process.env.FBA_EMAIL,
  client_id: '104804167075345407845',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://accounts.google.com/o/oauth2/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hmrg2%40callout-bce1b.iam.gserviceaccount.com',
};

// dont exist when there is no key in env
const fbaProvider = process.env.FBA_KEY ? admin.initializeApp({
  credential: admin.credential.cert(options),
}) : null;
const sendPush = ({ token, title, message, payload }) => {
  const bundle = {
    notification: {
      title,
      body: message,
    },
    token,
    data: payload,
  };

  if (admin.auth !== null) {
    console.log('FCM ready to send');
    return admin.messaging().send(bundle);
  }

  return Promise.reject(Error('FCM failed'));
};


export { fbaProvider, admin, sendPush };
