import React from 'react';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import { Alert } from 'react-native';

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
    this.didRegister = false;
  }

  componentDidMount() {
    this.onMountOrUpdate();
  }

  shouldComponentUpdate(nextProps) {
    // dont run anything if the cause of the update was a change in stored device token
    // because we caused the change to happen

    // if the new token is what we just sent to the server and this is apollo
    // updating the prop with the answer
    if (
      nextProps.device &&
      nextProps.device.pushToken === JSON.stringify(this.props.pushManager.tokens)) {
      console.log('nextProp pushToken matches the pushmanager token, returing false');
      return false;
    }
    return true;
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
    const { onTokenUpdate, onNotification, onNotificationOpened } = this;

    // we're expecting to get updated with the push token from the server
    if (isLoggedIn(auth) && !this.didRegister) {
      this.didRegister = true;
      pushManager.register({ onTokenUpdate, onNotification, onNotificationOpened });
    }
    this.updateTokensMaybe();
  }

  onTokenUpdate = () => {
    // this will get called once we have a valid set of push tokens from the client push libs
    // it may get called again later if the tokens change
    this.updateTokensMaybe();
  }

  onNotification = (data) => {
    // FCM onNotification has slightly different data format compared to onNotificationOpened
    console.log('onNotification', data);
    Alert.alert(
      data.title,
      data.body,
      [
        { text: 'OK' },
      ],
      { cancelable: false },
    );
  }

  onNotificationOpened = (data) => {
    const payload = JSON.parse(data.notification.data.data);
    console.log('onNotificationOpened', data);
    switch (payload.type) {
      case 'event':
        this.props.navigation.navigate('EventNewResponse', { eventId: payload.id });
        break;
      case 'eventMessage':
        this.props.navigation.navigate('EventNewResponse', { eventId: payload.id });
        break;
      default:
        break;
    }
  }

  updateTokensMaybe() {
    // we don't know whether we will receive which of the following we will receive first so we
    // need to call this function after either are updated:
    // - push token from push client library
    // - push token from the server
    // If once we receive both we determine they are different then we need to sync them
    console.log('Asked to update tokens maybe');

    const { device, pushManager } = this.props;

    if (!device) {
      log('Cannot update tokens yet because there is no device token');
      return;
    }

    if (!pushManager.hasAllTokens) {
      log('Cannot update tokens yet because they are still loading');
      return;
    }

    console.log('Have device and tokens, will compare to stored server answer');

    // this needs to understand what to do with multiple tokens
    const jsonTokens = JSON.stringify(pushManager.tokens);
    log('Server has: ', device.pushToken);
    if (jsonTokens !== device.pushToken) {
      log('Sending tokens to the server: ', jsonTokens);
      this.props.updateDevice({
        token: jsonTokens,
        name: DeviceInfo.getDeviceName(),
      }).then(() => {
        log('Token update was successful');
      }).catch((err) => {
        log('Token update failed: ', err);
      });
    } else {
      log('Not sending tokens to the server');
    }
  }

  render() {
    return null;
  }
}
PushHandler.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  pushManager: PropTypes.object,
  updateDevice: PropTypes.func,
  auth: PropTypes.shape().isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
  device: PropTypes.shape({
    pushToken: PropTypes.string,
  }),
};

export default PushHandler;
