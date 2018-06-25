import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { GRAPHQL_ENDPOINT } from './config';

import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';

import { logout } from './actions/auth';

import './styles/styles.scss';

const { store, persistor } = configureStore();

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });

const authMiddleware = new ApolloLink((operation, forward) => {
  if (store.getState().auth.token) {
    operation.setContext({
      headers: {
        authorization: store.getState().auth.token ? `Bearer ${store.getState().auth.token}` : null,
      },
    });
  }

  return forward(operation);
});

const logoutLink = onError((networkError) => {
  if (networkError.statusCode === 401) store.dispatch(logout());
});

const client = new ApolloClient({
  link: concat(authMiddleware, logoutLink.concat(httpLink)),
  cache: new InMemoryCache(),
});

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#232E4E',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contast with palette.primary.main
    },
    secondary: {
      main: '#f48603',
    },
    // error: will use the default color
  },
  overrides: {
    MuiTableCell: {
      // Name of the component ⚛️ / style shee
      root: {
        // Name of the rule
        padding: 10,
      },
    },
    MuiIconButton: {
      root: {
        height: 24,
      },
    },
  },
});

const jsx = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={client}>
        <MuiThemeProvider theme={theme}>
          <AppRouter />
        </MuiThemeProvider>
      </ApolloProvider>
    </PersistGate>
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('app'));
