import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import { appStyles } from './style-sheet';
import CURRENT_USER_QUERY from '../graphql/current-user.query';

const styles = StyleSheet.create(appStyles);

class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({ tintColor}) => <Icon size={30} name={'home'} color={tintColor} />
  };

  constructor(props) {
    super(props);
  }

  onRefresh() {
    this.props.refetch();
  }

  keyExtractor = item => item.id;

  render() {
    const { loading, user, networkStatus } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.warning}>{'Welcome home.'}</Text>
      </View>
    );
  }
}
Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps)(Home);
