import {
  AUTHORIZE_URL,
  CLIENT_ID,
  LOGOUT_URL,
  REDIRECT_URL,
  RESPONSE_TYPE,
  SCOPE,
} from '../config/Global';

export const getAuthUrl = () =>
  `${AUTHORIZE_URL}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URL}`;

export const getLogoutUrl = () => LOGOUT_URL;
