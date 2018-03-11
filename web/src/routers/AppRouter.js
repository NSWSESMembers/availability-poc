import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Reboot from 'material-ui/Reboot';

import LoginPage from '../screens/public/LoginPage';
import SignupPage from '../screens/public/SignUpPage';
import NotFoundPage from '../screens/public/NotFoundPage';

import Dashboard from '../screens/private/Dashboard';
import ViewSchedule from '../screens/private/Schedules/ViewSchedule';
import AddSchedule from '../screens/private/Schedules/AddSchedule';

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
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/request/:id" component={ViewSchedule} />
        <PrivateRoute path="/request" component={AddSchedule} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;
