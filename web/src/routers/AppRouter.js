import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Reboot from 'material-ui/Reboot';

import LoginPage from '../screens/public/LoginPage';
import SignupPage from '../screens/public/SignupPage';
import NotFoundPage from '../screens/public/NotFoundPage';

import DashboardPage from '../screens/private/DashboardPage';

import Header from '../screens/partial/Header';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <Reboot />
      <Header />
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact />
        <PublicRoute path="/signup" component={SignupPage} exact />
        <PrivateRoute path="/dashboard" component={DashboardPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;
