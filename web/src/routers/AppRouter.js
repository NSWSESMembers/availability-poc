import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Reboot from 'material-ui/Reboot';

import DashboardPage from '../screens/DashboardPage';
import HomePage from '../screens/HomePage';
import NotFoundPage from '../screens/NotFoundPage';
import Header from '../components/layout/Header';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <Reboot />
      <Header />
      <Switch>
        <PublicRoute path="/" component={HomePage} exact />
        <PrivateRoute path="/dashboard" component={DashboardPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;
