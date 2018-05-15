import React from 'react';
import { AsyncStorage, Alert } from 'react-native';
import { Client as BugSnagClient } from 'bugsnag-react-native';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';

import { ApolloProvider } from 'react-apollo';
import { createStore } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import _ from 'lodash';
import { RootNavigator } from './navigation';
import auth from './state/auth.reducer';
import local from './state/local.reducer';
import { PushManager } from './push';
import { logout } from './state/auth.actions';
import { GRAPHQL_ENDPOINT } from './config';

function noop() {}

if (!__DEV__) {
  console.log = noop;
  console.warn = noop;
  console.error = noop;
}

console.log(`Using GraphQL endpoint: ${GRAPHQL_ENDPOINT}`);

let store;

export const bugsnag = !__DEV__ ? new BugSnagClient() : undefined;
export const pushManager = new PushManager();

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });

// replaces networkInterface.use(applyMiddleware...)
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  if (store.getState().auth.token) {
    operation.setContext({
      headers: {
        authorization: store.getState().auth.token ? `Bearer ${store.getState().auth.token}` : null,
      },
    });
  }

  return forward(operation);
});


// logger
const LoggerLink = new ApolloLink((operation, forward) => {
  if (__DEV__) console.log(`[GraphQL Logger] ${operation.operationName}`);
  return forward(operation).map((result) => {
    if (__DEV__) {
      console.log(
        `[GraphQL Logger] received result from ${operation.operationName}`,
      );
    }
    return result;
  });
});

// error - use your error lib here
const ErrorLink = onError(({ response, operation, graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL Error] Message: ${message}, Location: ${locations}, Path: ${path}`,
      ));
  }
  if (operation.operationName === 'IgnoreErrorsQuery') {
    response.errors = null;
  }
  if (networkError) {
    console.log(`[Network error] ${networkError}`);
  }
});


// avoid spamming the user by suppressing alerts for 1s after the first one
const warnLogout = _.debounce(() => {
  Alert.alert(
    'Auth invalid',
    'Your authentication session is invalid so you have been logged out. ' +
      'If this occurred during testing it is probably because the server got ' +
      'restarted or otherwise lost your user/device record.',
  );
}, 1000);

const logoutLink = onError(({ networkError }) => {
  if (networkError.statusCode === 401) {
    warnLogout();
    store.dispatch(logout());
  }
});


export const client = new ApolloClient({
  link: ApolloLink.from([ErrorLink, LoggerLink, authMiddleware, logoutLink, httpLink]),
  cache: new InMemoryCache(),
});

const reduxConfig = {
  key: 'primary',
  debug: __DEV__,
  storage: AsyncStorage,
  blacklist: ['apollo'], // never persist these things
};

const reducers = {
  auth,
  local,
};

store = createStore(
  persistCombineReducers(reduxConfig, reducers),
);

// persistent storage
persistStore(store);

// start up push notification handler
pushManager.init().then(() => { console.log('Push is ready'); });

const App = () => (
  <ApolloProvider store={store} client={client}>
    <RootNavigator />
  </ApolloProvider>
);

export default App;
