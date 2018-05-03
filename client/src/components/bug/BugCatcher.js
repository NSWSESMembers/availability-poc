import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import { bugsnag, bugsnagConfig } from '../../app';

import setDebugState from '../../state/local.actions';


class BugCatcher extends React.Component {
  componentDidMount() {
    if (this.props.local.bugReport === 0) {
      Alert.alert(
        'Automatic Bug Reporting',
        'To help us troubleshoot errors, Is it OK if we automatically send bug reports? Can we also include your username in the report?',
        [
          { text: 'Disable Reporting', onPress: () => this.saveDebugState(1) },
          { text: 'Keep Reporting', onPress: () => this.saveDebugState(2) },
          { text: 'Report And Include Username', onPress: () => this.saveDebugState(3) },
        ],
        { cancelable: false },
      );
    } else {
      this.setDebugState(this.props.local.bugReport);
    }
  }


  setDebugState = (value) => {
    switch (value) {
      case 3:
        this.setUserDetails(`${this.props.auth.id}`, this.props.auth.username);
        break;
      case 2:
        // already enabled at run
        break;
      default:
        this.disable();
    }
  }


setUserDetails = (id, username) => {
  bugsnag.setUser(id, username);
}

  enable = () => {
    bugsnagConfig.registerBeforeSendCallback(() =>
      true);
  }

  disable = () => {
    bugsnagConfig.registerBeforeSendCallback(() =>
      false);
  }

  saveDebugState = (value) => {
    this.props.dispatch(setDebugState(value));
    this.setDebugState(value);
  }

  clearUserDetails = () => {
    bugsnag.clearUser();
  }


  render() {
    return null;
  }
}

const mapStateToProps = ({ local, auth }) => ({
  local,
  auth,
});


BugCatcher.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  auth: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  local: PropTypes.shape({
    bugReport: PropTypes.number,
  }),
  dispatch: PropTypes.func.isRequired,
};


export default connect(mapStateToProps)(BugCatcher);
