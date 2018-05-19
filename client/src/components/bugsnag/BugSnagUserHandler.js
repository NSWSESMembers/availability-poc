import React from 'react';
import PropTypes from 'prop-types';
import { isLoggedIn } from '../../selectors/auth';

class BugSnagUserHandler extends React.Component {
  constructor() {
    super();
    this.didRegister = false;
  }

  componentDidMount() {
    this.onMountOrUpdate();
  }

  componentDidUpdate() {
    this.onMountOrUpdate();
  }


  onMountOrUpdate() {
    const { auth, bugsnag } = this.props;

    if (isLoggedIn(auth) && !this.didRegister && bugsnag && bugsnag.setUser) {
      this.didRegister = true;
      bugsnag.setUser(`${auth.id}`, auth.username);
      console.log('Bugsnag user identification is complete');
    }
  }

  render() {
    return null;
  }
}


BugSnagUserHandler.propTypes = {
  auth: PropTypes.shape().isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  bugsnag: PropTypes.object, // __DEV__ friendly
};

export default BugSnagUserHandler;
