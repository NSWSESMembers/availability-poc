import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Reboot from 'material-ui/Reboot';

import LoginPage from '../screens/public/LoginPage';
import SignupPage from '../screens/public/SignUpPage';
import NotFoundPage from '../screens/public/NotFoundPage';

import Dashboard from '../screens/private/Dashboard';

import ViewSchedules from '../screens/private/Schedules/ViewSchedules';
import ViewSchedule from '../screens/private/Schedules/ViewSchedule';
import AddSchedule from '../screens/private/Schedules/AddSchedule';

import ViewEvents from '../screens/private/Events/ViewEvents';
import ViewEvent from '../screens/private/Events/ViewEvent';
import AddEvent from '../screens/private/Events/AddEvent';

import ViewGroups from '../screens/private/Groups/ViewGroups';
import ViewGroup from '../screens/private/Groups/ViewGroup';
import AddGroup from '../screens/private/Groups/AddGroup';

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
        <PrivateRoute path="/groups" component={ViewGroups} exact />
        <PrivateRoute path="/groups/add" component={AddGroup} exact />
        <PrivateRoute path="/groups/:id" component={ViewGroup} />
        <PrivateRoute path="/schedules" component={ViewSchedules} exact />
        <PrivateRoute path="/schedules/add" component={AddSchedule} exact />
        <PrivateRoute path="/schedules/:id" component={ViewSchedule} />
        <PrivateRoute path="/events" component={ViewEvents} exact />
        <PrivateRoute path="/events/add" component={AddEvent} exact />
        <PrivateRoute path="/events/:id" component={ViewEvent} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;
