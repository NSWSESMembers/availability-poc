import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

class SignUp extends Component {
  render() {
    return (
      <View>
        <Text>Auth Index</Text>
      </View>
    );
  }
}

const mapStateToProps = ({ auth, local }) => ({
  auth,
  local,
});

export default compose(connect(mapStateToProps))(SignUp);
