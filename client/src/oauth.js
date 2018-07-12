import { Platform } from 'react-native';
import { authorize } from 'react-native-app-auth';

const clientId = Platform.select({
  ios: 'callout.ios.test',
  android: 'callout.android.test',
});

const clientSecret = Platform.select({
  ios: 'Hy4^&sdERVojk08#4Ee',
  android: 'Hy4^&sdERVojk08#4Ee',
});

const config = {
  issuer: 'https://identitytest.ses.nsw.gov.au/core',
  clientId,
  clientSecret,
  redirectUrl: 'com.sdunster.callout:/oauthredirect',
  scopes: ['openid', 'profile', 'offline_access'],
};

const myAuthorize = () => authorize(config);

export default { authorize: myAuthorize };
