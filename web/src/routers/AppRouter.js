import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import LoginPage from '../screens/public/LoginPage';
import SignupPage from '../screens/public/SignUpPage';
import NotFoundPage from '../screens/public/NotFoundPage';

import Dashboard from '../screens/private/Dashboard';

import ViewSchedules from '../screens/private/Schedules/ViewSchedules';
import ViewSchedule from '../screens/private/Schedules/ViewSchedule';
import ViewScheduleDay from '../screens/private/Schedules/ViewScheduleDay';
import EditSchedule from '../screens/private/Schedules/EditSchedule';

import ViewEvents from '../screens/private/Events/ViewEvents';
import EditEvent from '../screens/private/Events/EditEvent';

import ViewGroups from '../screens/private/Groups/ViewGroups';
import EditGroup from '../screens/private/Groups/EditGroup';

import ViewUser from '../screens/private/Users/ViewUser';

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
        <PrivateRoute path="/groups/add" component={EditGroup} exact />
        <PrivateRoute path="/groups/:id" component={EditGroup} />
        <PrivateRoute path="/schedules" component={ViewSchedules} exact />
        <PrivateRoute path="/schedules/add" component={EditSchedule} exact />
        <PrivateRoute path="/schedules/edit/:id" component={EditSchedule} />
        <PrivateRoute path="/schedules/:id/:time" component={ViewScheduleDay} />
        <PrivateRoute path="/schedules/:id" component={ViewSchedule} />
        <PrivateRoute path="/events" component={ViewEvents} exact />
        <PrivateRoute path="/events" component={EditEvent} exact />
        <PrivateRoute path="/events/:id" component={EditEvent} />
        <PrivateRoute path="/users/:id" component={ViewUser} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;
