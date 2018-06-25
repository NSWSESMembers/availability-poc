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

import { setCurrentUser } from '../../actions/auth';
import { uuidv4 } from '../../utils';

import SIGNUP_MUTATION from '../../graphql/signup.mutation';

const styles = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: 300,
    textAlign: 'center',
  },
});

class SignupPage extends React.Component {
  state = {
    open: false,
    message: '',
    username: '',
    password: '',
    email: '',
  };

  onUsernameChange = (e) => {
    const username = e.target.value;
    this.setState({ username });
  };

  onEmailChange = (e) => {
    const email = e.target.value;
    this.setState({ email });
  };

  onPasswordChange = (e) => {
    const password = e.target.value;
    this.setState({ password });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const deviceUuid = uuidv4();

    const { username, password, email } = this.state;
    this.props
      .signup({ username, email, password, deviceUuid })
      .then(({ data: { signup: user } }) => {
        const ourUser = {
          id: user.id,
          username: user.username,
          token: user.authToken,
        };
        this.props.dispatch(setCurrentUser(ourUser));
      })
      .catch((error) => {
        this.setState(() => ({ message: error.message, open: true }));
        setTimeout(() => {
          this.setState(() => ({ message: '', open: false }));
        }, 3000);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <form onSubmit={this.onSubmit}>
        <div className={classes.container}>
          <div className={classes.wrapper}>
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
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              type="text"
              margin="normal"
              value={this.state.email}
              onChange={this.onEmailChange}
            />
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <Button variant="raised" color="primary" className={classes.button} type="submit">
                  Register
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Already have an account? <Link to="/">Login</Link>
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

const signup = graphql(SIGNUP_MUTATION, {
  props: ({ mutate }) => ({
    signup: ({ username, email, password, deviceUuid }) =>
      mutate({
        variables: { user: { username, email, password, deviceUuid } },
      }),
  }),
});

SignupPage.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  dispatch: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
};

export default compose(connect(), withStyles(styles), signup)(SignupPage);
