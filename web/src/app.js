import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-link';
import { onError } from 'apollo-link-error';

import { Provider } from 'react-redux';

import { GRAPHQL_ENDPOINT } from './config';

import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';

const store = configureStore();

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });

const authMiddleware = new ApolloLink((operation, forward) => {
  console.log('midware', store.getState());
  if (store.getState().auth.token) {
    operation.setContext({
      headers: {
        authorization: store.getState().auth.token || null,
      },
    });
  }

  return forward(operation);
});

// const logoutLink = onError((e) => {
//   console.log(store.getState());
//   console.log('net', e);
//   // if (networkError.statusCode === 401) console.log('dispatch logout');
// });

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});

/*

networkInterface.use([
  {
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
  },
]);

*/

const jsx = (
  <Provider store={store}>
    <ApolloProvider client={client}>
      <AppRouter />
    </ApolloProvider>
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('app'));
