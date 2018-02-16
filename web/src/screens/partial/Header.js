import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { logout } from '../../actions/auth';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
};

class Header extends React.Component {
  handleLogout = () => {
    this.props.dispatch(logout());
  };
  render() {
    const { classes, isAuthenticated } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              <NavLink to="/" className={classes.link}>
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
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  dispatch: PropTypes.func,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: !!state.auth.token,
});

export default compose(connect(mapStateToProps), withStyles(styles))(Header);
