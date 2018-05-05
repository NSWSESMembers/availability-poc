import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import codePush from 'react-native-code-push';

import { Container } from '../../components/Container';
import ParamsList from './components/ParamsList';
import { gatherDeviceInfo } from '../../selectors/deviceInfo';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';
import CURRENT_DEVICE_QUERY from '../../graphql/current-device.query';

const stringify = obj => JSON.stringify(obj, null, 2);

class ParamsScreen extends Component {
  static navigationOptions = {
    title: 'Internal Parameters',
  };

  state = {
    deviceInfo: 'not loaded',
    packageInfo: 'not loaded',
  };

  componentDidMount() {
    gatherDeviceInfo().then((result) => {
      const deviceInfo = stringify(result);
      this.setState({ deviceInfo });
    });
    codePush.getCurrentPackage().then((result) => {
      const packageInfo = result ? stringify(result) : 'no package';
      this.setState({ packageInfo });
    });
  }

  render() {
    const { deviceInfo, packageInfo } = this.state;
    const { user, device, auth } = this.props;
    return (
      <Container>
        <ParamsList
          deviceInfo={deviceInfo}
          packageInfo={packageInfo}
          user={stringify(user)}
          device={stringify(device)}
          auth={stringify(auth)}
        />
      </Container>
    );
  }
}

ParamsScreen.propTypes = {
  user: PropTypes.shape({}),
  device: PropTypes.shape({}),
  auth: PropTypes.shape({}),
};

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ({ auth }) => ({ variables: { id: auth.id }, fetchPolicy: 'cache-only' }),
  props: ({ data }) => ({
    user: data,
  }),
});

const deviceQuery = graphql(CURRENT_DEVICE_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ({ auth }) => ({ variables: { id: auth.id }, fetchPolicy: 'cache-only' }),
  props: ({ data }) => ({
    device: data,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  userQuery,
  deviceQuery,
)(ParamsScreen);
