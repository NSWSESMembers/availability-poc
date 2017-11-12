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

import CURRENT_USER_QUERY from '../graphql/current-user.query';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
  groupContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  groupName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
  groupTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  groupText: {
    color: '#8c8c8c',
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  groupTitleContainer: {
    flexDirection: 'row',
  },
  groupLastUpdated: {
    flex: 0.3,
    color: '#8c8c8c',
    fontSize: 11,
    textAlign: 'right',
  },
  groupUsername: {
    paddingVertical: 4,
  },
  header: {
    alignItems: 'flex-start',
    padding: 6,
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
  warning: {
    textAlign: 'center',
    padding: 12,
  },
});

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
