import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CssBaseline from 'material-ui/CssBaseline';

import LoginPage from '../screens/public/LoginPage';
import SignupPage from '../screens/public/SignUpPage';
import NotFoundPage from '../screens/public/NotFoundPage';

import Dashboard from '../screens/private/Dashboard';

import ViewSchedules from '../screens/private/Schedules/ViewSchedules';
import ViewSchedule from '../screens/private/Schedules/ViewSchedule';
import ViewScheduleDay from '../screens/private/Schedules/ViewScheduleDay';
import AddSchedule from '../screens/private/Schedules/AddSchedule';

import ViewEvents from '../screens/private/Events/ViewEvents';
import EditEvent from '../screens/private/Events/EditEvent';

import ViewGroups from '../screens/private/Groups/ViewGroups';
import EditGroup from '../screens/private/Groups/EditGroup';

import Header from '../screens/partial/Header';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <CssBaseline />
      <Header />
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact />
        <PublicRoute path="/signup" component={SignupPage} exact />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/groups" component={ViewGroups} exact />
        <PrivateRoute path="/groups/edit" component={EditGroup} exact />
        <PrivateRoute path="/groups/edit/:id" component={EditGroup} />
        <PrivateRoute path="/schedules" component={ViewSchedules} exact />
        <PrivateRoute path="/schedules/add" component={AddSchedule} exact />
        <PrivateRoute path="/schedules/:id/:time" component={ViewScheduleDay} />
        <PrivateRoute path="/schedules/:id" component={ViewSchedule} />
        <PrivateRoute path="/events" component={ViewEvents} exact />
        <PrivateRoute path="/events/edit" component={EditEvent} exact />
        <PrivateRoute path="/events/edit/:id" component={EditEvent} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;
