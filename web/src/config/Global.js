import moment from 'moment';
import { isDev } from '../utilities/GeneralTools';

export const CLIENT_ID = isDev() ? 'callout.web.local' : 'callout.web.test';
export const SCOPE = 'public';
export const RESPONSE_TYPE = 'token';
export const AUTHORIZE_URL = 'https://identitytest.ses.nsw.gov.au/core/connect/authorize';
export const LOGOUT_URL = `https://identitytest.ses.nsw.gov.au/core/connect/endsession?post_logout_redirect_uri=${isDev()
  ? 'http://localhost:5000/logout'
  : 'https://web.callout.nsws.es/logout'}`;
export const REDIRECT_URL = isDev()
  ? 'http://localhost:5000/redirect'
  : 'https://web.callout.nsws.es/redirect';

export const BASE_API_URI = 'https://apitestbeacon.ses.nsw.gov.au/Api/v2';
export const API_TIMEOUT = 15000;

export const API_DATE_FORMAT = 'DD-MM-YYYY';
export const VIEW_DATE_FORMAT = 'DD MMM YYYY';
export const DATE_LOCALE = {
  format: 'YYYY-MM-DD',
  separator: ' - ',
  applyLabel: 'Apply',
  cancelLabel: 'Cancel',
  weekLabel: 'W',
  customRangeLabel: 'Custom Range',
  daysOfWeek: moment.weekdaysMin(),
  monthNames: moment.monthsShort(),
  firstDay: moment.localeData().firstDayOfWeek(),
};
