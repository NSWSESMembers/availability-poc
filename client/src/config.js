const GRAPHQL_HTTP_ENDPOINT_PROD = 'https://ses-availability-api.herokuapp.com/graphql';
const GRAPHQL_HTTP_ENDPOINT_LOCAL = 'http://localhost:8080/graphql';

const GRAPHQL_WS_ENDPOINT_PROD = 'wss://ses-availability-api.herokuapp.com/subscriptions';
const GRAPHQL_WS_ENDPOINT_LOCAL = 'ws://localhost:8080/subscriptions';

const GRAPHQL_HTTP_ENDPOINT =
__DEV__ ? GRAPHQL_HTTP_ENDPOINT_LOCAL : GRAPHQL_HTTP_ENDPOINT_PROD;

const GRAPHQL_WS_ENDPOINT =
__DEV__ ? GRAPHQL_WS_ENDPOINT_LOCAL : GRAPHQL_WS_ENDPOINT_PROD;

export { GRAPHQL_HTTP_ENDPOINT, GRAPHQL_WS_ENDPOINT };
