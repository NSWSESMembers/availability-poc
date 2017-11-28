export const GRAPHQL_ENDPOINT_PROD = 'https://ses-availability-api.herokuapp.com/graphql';
export const GRAPHQL_ENDPOINT_LOCAL = 'http://172.16.0.21:8080/graphql';

export const GRAPHQL_ENDPOINT = __DEV__ ? GRAPHQL_ENDPOINT_LOCAL : GRAPHQL_ENDPOINT_PROD;
export default GRAPHQL_ENDPOINT;
