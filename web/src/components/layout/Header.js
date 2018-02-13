import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Hidden from 'material-ui/Hidden';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

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

const Header = ({ classes, isAuthenticated }) => (
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="title" color="inherit" className={classes.flex}>
          <NavLink to="/" className={classes.link}>
            Callout
          </NavLink>
        </Typography>
        <Button color="inherit">
          <NavLink to="/Login" className={classes.link}>
            Login
          </NavLink>
        </Button>
      </Toolbar>
    </AppBar>
  </div>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: !!state.auth.uid,
});

export default compose(connect(mapStateToProps), withStyles(styles))(Header);
