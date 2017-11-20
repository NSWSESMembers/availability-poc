import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Button,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import { extendAppStyleSheet } from './style-sheet';
import GROUP_USERS_QUERY from '../graphql/groups-users.query';

const styles = extendAppStyleSheet({
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

// format createdAt with moment
const formatCreatedAt = createdAt => moment(createdAt).calendar(null, {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: 'dddd',
  sameElse: 'DD/MM/YYYY',
});

const Header = ({ onPress, onPressFind }) => (
  <View style={styles.header}>
  </View>
);
Header.propTypes = {
};

class Member extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, username } = this.props.member;
    console.log(this.props)
    return (
      <TouchableHighlight
        key={id}
      >
        <View style={styles.groupContainer}>
          <Icon name="user" size={24} color={'blue'} />
          <View style={styles.groupTextContainer}>
            <View style={styles.groupTitleContainer}>
              <Text style={styles.groupName} numberOfLines={1}>{username}</Text>
              <Text style={styles.groupLastUpdated}>{id}</Text>
            </View>
            <Text style={styles.groupUsername}>
            </Text>
            <Text style={styles.groupText} numberOfLines={1}>
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

Member.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }),
};

class Group extends Component {
  static navigationOptions = {
    title: 'Group',
    tabBarIcon: ({ tintColor}) => <Icon size={24} name={'group'} color={tintColor} />
  };

  constructor(props) {
    super(props);
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.props.refetch();
  }

  keyExtractor = item => item.id;

  renderItem = ({ item }) => <Member member={item}/>;


  render() {
    const { loading, user, networkStatus } = this.props;
    // render loading placeholder while we fetch messages
    if (loading || !user) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    // render group stuff
    return (
      <View style={styles.container}>
      <Text style={styles.warning}>{this.props.navigation.state.params.title}</Text>
      <Text style={styles.warning}>{this.props.navigation.state.params.tags}</Text>

      <FlatList
        //TODO: Make a query that pulls just the one group back, not all of them
        //find the array object with the same name as the one passed
        data={user.organisation.groups.find((element) => {if(element.name == this.props.navigation.state.params.title){return element}}).users}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        ListHeaderComponent={() => <Header onPress={this.goToNewGroup} onPressFind={this.goToSearchGroup} />}
        onRefresh={this.onRefresh}
        refreshing={networkStatus === 4}
      />
      </View>
    );
  }
}

Group.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    organisation: PropTypes.shape({
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          users: PropTypes.arrayOf(
            PropTypes.shape({
              username: PropTypes.string.isRequired,
              id: PropTypes.number.isRequired,
            }),
          ),
        }),
      ),
    }),
  }),
};

const groupUsersQuery = graphql(GROUP_USERS_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading, networkStatus, refetch, user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  groupUsersQuery,
)(Group);
