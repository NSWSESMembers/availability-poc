import React from 'react';
import PropTypes from 'prop-types';

import { isLoggedIn } from '../../selectors/auth';

let log;

/* istanbul ignore else: trivial log function */
if (__DEV__) {
  // eslint-disable-next-line prefer-destructuring
  log = console.log;
} else {
  log = () => {};
}

class PushHandler extends React.Component {
  constructor() {
    super();
    this.updatePromise = null;
  }
  componentDidMount() {
    this.onMountOrUpdate();
  }

  componentDidUpdate() {
    this.onMountOrUpdate();
  }

  componentWillUnmount() {
    this.props.pushManager.deregister().then(() => {
      log('de-registered from notifications');
    });
  }

  onMountOrUpdate() {
    const { auth, pushManager } = this.props;
    const { onTokenUpdate } = this;

    // we're expecting to get updated with the push token from the server
    if (isLoggedIn(auth)) {
      pushManager.register({ onTokenUpdate });
    }
    this.updateTokensMaybe();
  }

  onTokenUpdate = (tokens) => {
    // this will get called once we have a valid set of push tokens from the client push libs
    // it may get called again later if the tokens change
    this.tokens = tokens;
    this.updateTokensMaybe();
  }

  tokens = null;

  updateTokensMaybe() {
    // we don't know whether we will receive which of the following we will receive first so we
    // need to call this function after either are updated:
    // - push token from push client library
    // - push token from the server
    // If once we receive both we determine they are different then we need to sync them
    const { device } = this.props;

    if (!device) {
      log('cannot update tokens yet because there is no device');
      return;
    }

    if (!this.tokens) {
      log('cannot update tokens yet because there is no tokens');
      return;
    }

    // this needs to understand what to do with multiple tokens
    const jsonTokens = JSON.stringify(this.tokens);
    log('Server has: ', device.pushToken);
    if (jsonTokens !== device.pushToken) {
      log('Sending tokens to the server: ', jsonTokens);
      this.updatePromise = this.props.updateToken({
        token: jsonTokens,
      }).then(() => {
        log('Token update was successful');
      }).catch((err) => {
        log('Token update failed: ', err);
      });
    }
  }

  render() {
    return null;
  }
}
PushHandler.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  pushManager: PropTypes.object,
  updateToken: PropTypes.func,
  auth: PropTypes.shape().isRequired,
  device: PropTypes.shape({
    pushToken: PropTypes.string,
  }),
};

export default PushHandler;
