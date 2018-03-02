import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Tabs, { Tab } from 'material-ui/Tabs';
import PhonelinkRingIcon from 'material-ui-icons/PhonelinkRing';

import { logout } from '../../actions/auth';

import styles from './Header.styles';

class Header extends React.Component {
  handleChange = () => {
    const { history } = this.props;
    if (history.location.pathname !== '/dashboard') {
      history.push('/dashboard');
    }
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
            <PhonelinkRingIcon className={classes.icon} />
            <Typography variant="headline" color="inherit" className={classes.flexGrow}>
              <NavLink to="/dashboard" className={classes.link}>
                Callout
              </NavLink>
            </Typography>
            {isAuthenticated && (
              <Button color="inherit" onClick={this.handleLogout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <AppBar position="static" color="default">
          <Tabs value="Requests" onChange={this.handleChange} style={{ marginLeft: 30 }}>
            <Tab value="Requests" label="Requests" />
          </Tabs>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}),
  dispatch: PropTypes.func,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: !!state.auth.token,
});

export default compose(connect(mapStateToProps), withStyles(styles))(withRouter(Header));
