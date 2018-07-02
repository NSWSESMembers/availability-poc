const isDev = () => {
  const hostname = window && window.location && window.location.hostname;
  if (hostname === 'localhost') {
    return true;
  }
  return false;
};

export const STATUS_AVAILABLE = 'Available';
export const STATUS_UNAVAILABLE = 'Unavailable';
export const STATUS_UNLESS_URGENT = 'Urgent';

export const GRAPHQL_ENDPOINT_PROD = 'https://ses-availability-api.herokuapp.com/graphql';
export const GRAPHQL_ENDPOINT_LOCAL = 'http://localhost:8080/graphql';

export const SCHEDULE_TYPE_LOCAL = 'local';
export const SCHEDULE_TYPE_DEPLOYMENT = 'deployment';

export const GRAPHQL_ENDPOINT = isDev() ? GRAPHQL_ENDPOINT_LOCAL : GRAPHQL_ENDPOINT_PROD;
export default GRAPHQL_ENDPOINT;
