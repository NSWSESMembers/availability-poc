import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';

/*

import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import { addExpense } from './actions/expenses';
import { setTextFilter } from './actions/filters';
import getVisibleExpenses from './selectors/expenses';
*/

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <MuiThemeProvider>
      <AppRouter />
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('app'));
