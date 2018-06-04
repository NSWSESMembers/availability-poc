import apn from 'apn';

const makeCertBuffer = (cert) => {
  const header = '-----BEGIN PRIVATE KEY-----';
  const footer = '-----END PRIVATE KEY-----';
  return Buffer.from(`${header}\n${cert}\n${footer}`);
};

const options = {
  token: {
    key: makeCertBuffer(process.env.APNS_KEY),
    keyId: '3J9V5NSPMB', // key name: APNS
    teamId: 'J552XHFXEC', // Sam Dunster
  },
  production: true,
};

const topic = 'com.sdunster.callout';

// hack to make tests dev server and tests work. Later on we should mock this out properly
const apnProvider = process.env.APNS_KEY ? new apn.Provider(options) : null;
if (apnProvider === null) {
  console.warn('No APNS_KEY is set');
}

const sendPush = ({ token, message, payload }) => {
  const note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.alert = message;
  note.topic = topic;
  note.payload = payload;

  if (apnProvider === null) {
    console.log('Cannot send APNS push - maybe you forgot to set APNS_KEY');
  }

  return apnProvider.send(note, token);
};

export { apnProvider, apn, topic, sendPush };
