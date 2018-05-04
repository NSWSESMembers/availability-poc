import apn from 'apn';

const options = {
  token: {
    key: 'apns.p8',
    keyId: '3J9V5NSPMB', // key name: APNS
    teamId: 'J552XHFXEC', // Sam Dunster
  },
  production: true,
};
const topic = 'com.sdunster.callout';

const apnProvider = new apn.Provider(options);

export { apnProvider, apn, topic };
