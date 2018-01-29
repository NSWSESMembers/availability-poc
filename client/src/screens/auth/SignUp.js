import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import PropTypes from 'prop-types';

import { setCurrentUser } from '../../state/auth.actions';

import { Alert } from '../../components/Alert';
import { Container, Holder } from '../../components/Container';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import SIGNUP_MUTATION from '../../graphql/signup.mutation';

class SignUp extends Component {
  static navigationOptions = () => ({
    title: 'Register',
  });

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
    };
  }

  onChangeEmail = (value) => {
    this.setState({
      email: value,
    });
  };

  onChangePassword = (value) => {
    this.setState({
      password: value,
    });
  };

  onChangeUsername = (value) => {
    this.setState({
      username: value,
    });
  };

  onPressSignUp = () => {
    const { deviceUuid } = this.props.local;
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
        this.setState({
          status: 'Sign Up Error',
          errorMessage: error.message,
        });
        this.popRef.show();
      });
  };

  render() {
    return (
      <Container>
        <Holder margin transparent>
          <Input type="username" placeholder="Username" onChangeText={this.onChangeUsername} />
          <Input type="password" placeholder="Password" onChangeText={this.onChangePassword} />
          <Input type="username" placeholder="Email" onChangeText={this.onChangeEmail} />
          <Button text="Register" onPress={this.onPressSignUp} />
        </Holder>
        <Alert
          ref={(el) => {
            this.popRef = el;
          }}
          status={this.state.status}
          message={this.state.errorMessage}
        />
      </Container>
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

SignUp.propTypes = {
  dispatch: PropTypes.func.isRequired,
  local: PropTypes.shape({
    deviceUuid: PropTypes.string,
  }),
  signup: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth, local }) => ({
  auth,
  local,
});

export default compose(signup, connect(mapStateToProps))(SignUp);
