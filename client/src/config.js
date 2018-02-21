import { Platform } from 'react-native';


export const GRAPHQL_ENDPOINT_PROD = 'https://ses-availability-api.herokuapp.com/graphql';
export const GRAPHQL_ENDPOINT_LOCAL = Platform.OS === 'ios' ?
  'http://localhost:8080/graphql' :
  'http://192.168.56.1:8080/graphql';

export const GRAPHQL_ENDPOINT = __DEV__ ? GRAPHQL_ENDPOINT_LOCAL : GRAPHQL_ENDPOINT_PROD;
export default GRAPHQL_ENDPOINT;
