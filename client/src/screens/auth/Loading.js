import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import { connect } from 'react-redux';

import { isLoggedIn } from '../../selectors/auth';
import { Container } from '../../components/Container';
import { Progress } from '../../components/Progress';

class Loading extends Component {
  componentDidUpdate() {
    const { auth } = this.props;
    if (!isLoggedIn(auth)) {
      console.log('Going from loading screen to auth because user is not logged in');
      this.props.navigation.navigate('Auth');
    } else {
      console.log('Going from loading screen to main because user is logged in');
      this.props.navigation.navigate('Main');
    }
  }

  render() {
    return (
      <Container>
        <Progress />
      </Container>
    );
  }
}

Loading.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  auth: PropTypes.shape().isRequired,
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps))(Loading);
