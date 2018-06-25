import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { uuidv4 } from '../../utils';
import { setCurrentUser } from '../../actions/auth';

import LOGIN_MUTATION from '../../graphql/login.mutation';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class LoginPage extends React.Component {
  state = {
    open: false,
    message: '',
    username: '',
    password: '',
  };

  onUsernameChange = (e) => {
    const username = e.target.value;
    this.setState(() => ({ username }));
  };
  onPasswordChange = (e) => {
    const password = e.target.value;
    this.setState(() => ({ password }));
  };

  onSubmit = (e) => {
    e.preventDefault();
    const deviceUuid = uuidv4();

    const { username, password } = this.state;
    this.props
      .login({ username, password, deviceUuid })
      .then(({ data: { login: user } }) => {
        const ourUser = {
          id: user.id,
          username: user.username,
          token: user.authToken,
        };
        this.props.dispatch(setCurrentUser(ourUser));
      })
      .catch((error) => {
        this.setState(() => ({ message: error.message, open: true }));
      });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <form onSubmit={this.onSubmit}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 300, textAlign: 'center' }}>
            <TextField
              required
              fullWidth
              id="username"
              label="Username"
              type="text"
              margin="normal"
              value={this.state.username}
              onChange={this.onUsernameChange}
            />
            <TextField
              required
              fullWidth
              id="password"
              label="Password"
              type="password"
              margin="normal"
              value={this.state.password}
              onChange={this.onPasswordChange}
            />
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <Button variant="raised" color="primary" className={classes.button} type="submit">
                  Login
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Need an account? <Link to="/signup">Register</Link>
                </Typography>
              </Grid>
            </Grid>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={this.state.open}
              onClose={this.handleClose}
              autoHideDuration={3000}
              message={<span id="message-id">{this.state.message}</span>}
            />
          </div>
        </div>
      </form>
    );
  }
}

const login = graphql(LOGIN_MUTATION, {
  props: ({ mutate }) => ({
    login: ({ username, password, deviceUuid }) =>
      mutate({
        variables: { user: { username, password, deviceUuid } },
      }),
  }),
});

LoginPage.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  dispatch: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: !!state.auth.token,
});

export default compose(connect(mapStateToProps), withStyles(styles), login)(LoginPage);
