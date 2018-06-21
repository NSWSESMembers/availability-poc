import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Tabs, { Tab } from 'material-ui/Tabs';

import { logout } from '../../actions/auth';

import styles from './Header.styles';

class Header extends React.Component {
  constructor(props) {
    super(props);
    const route = this.convertPathToRoute(props.location.pathname);
    this.state = {
      route,
    };
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen((location) => {
      const route = this.convertPathToRoute(location.pathname);
      this.setState({ route });
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  convertPathToRoute = (pathname) => {
    let route = 'Home';
    if (pathname.startsWith('/groups')) route = 'Groups';
    if (pathname.startsWith('/schedules')) route = 'Availability';
    if (pathname.startsWith('/events')) route = 'Events';
    return route;
  };

  handleChange = (event, value) => {
    const paths = {
      Home: '/dashboard',
      Groups: '/groups',
      Availability: '/schedules',
      Events: '/events',
    };
    let path = paths[value];
    if (typeof path === 'undefined') {
      path = '/dashboard';
    }
    const { history } = this.props;
    history.push(path);
  };

  handleLogout = () => {
    this.props.dispatch(logout());
  };

  render() {
    const { classes, isAuthenticated } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.flex}>
            <NavLink to="/dashboard">
              <img src="/logo.jpg" alt="Callout" />
            </NavLink>
            {isAuthenticated && (
              <Button color="inherit" onClick={this.handleLogout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <AppBar position="static" color="default">
          <Tabs value={this.state.route} onChange={this.handleChange} fullWidth centered>
            <Tab value="Home" label="Home" />
            <Tab value="Groups" label="Groups" />
            <Tab value="Availability" label="Availability" />
            <Tab value="Events" label="Events" />
          </Tabs>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({
    listen: PropTypes.func.isRequired,
  }),
  dispatch: PropTypes.func,
  isAuthenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};

const mapStateToProps = state => ({
  isAuthenticated: !!state.auth.token,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(withRouter(Header));
