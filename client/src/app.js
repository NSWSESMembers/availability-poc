import React from 'react';
import {
  AsyncStorage,
} from 'react-native';

import { ApolloProvider } from 'react-apollo';
import { createStore, applyMiddleware, compose } from 'redux';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { persistStore, persistCombineReducers } from 'redux-persist';
import thunk from 'redux-thunk';
import _ from 'lodash';

import AppWithNavigationState, { navigationReducer } from './navigation';
import auth from './state/auth.reducer';
import local from './state/local.reducer';
import { logout } from './state/auth.actions';
import { GRAPHQL_ENDPOINT } from './config';

console.log(`Using GraphQL endpoint: ${GRAPHQL_ENDPOINT}`);
const networkInterface = createNetworkInterface({ uri: GRAPHQL_ENDPOINT });
let store;

// middleware for requests
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    // get the authentication token from local storage if it exists
    const { token } = store.getState().auth;
    if (token) {
      req.options.headers.authorization = `Bearer ${token}`;
    }
    next();
  },
}]);

// afterware for responses
networkInterface.useAfter([{
  applyAfterware({ response }, next) {
    if (!response.ok) {
      response.clone().text().then((bodyText) => {
        console.log(`Network Error: ${response.status} (${response.statusText}) - ${bodyText}`);
        next();
      });
    } else {
      let isUnauthorized = false;
      response.clone().json().then(({ errors }) => {
        if (errors) {
          console.log('GraphQL Errors:', errors);
          if (_.some(errors, { message: 'Unauthorized' })) {
            isUnauthorized = true;
          }
        }
      }).then(() => {
        if (isUnauthorized) {
          store.dispatch(logout());
        }
        next();
      });
    }
  },
}]);

export const client = new ApolloClient({
  networkInterface,
});

const reduxConfig = {
  key: 'primary',
  debug: __DEV__,
  storage: AsyncStorage,
  blacklist: ['apollo', 'nav'], // don't persist apollo or nav for now
};

const reducers = {
  apollo: client.reducer(),
  nav: navigationReducer,
  auth,
  local,
};

store = createStore(
  persistCombineReducers(reduxConfig, reducers),
  {}, // initial state
  compose(
    applyMiddleware(client.middleware(), thunk),
  ),
);

// persistent storage
persistStore(store);

const App = () => (
  <ApolloProvider store={store} client={client}>
    <AppWithNavigationState />
  </ApolloProvider>
);

export default App;
