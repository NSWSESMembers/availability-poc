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

import { extendAppStyleSheet } from './style-sheet';
import ALL_GROUPS_QUERY from '../graphql/all-groups.query';
import JOIN_GROUP_QUERY from '../graphql/join-group.mutation';


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

class Group extends Component {
  constructor(props) {
    super(props);
    this.myGroups = this.props.myGroups;
    this.joinGroupQuery = this.props.joinGroupQuery.bind(this);
    this.joinGroup = this.props.joinGroup.bind(this, this.props.group);
  }

  render() {
    const { id, name } = this.props.group;
    //color the already subscribed groups green
    let iHaveDisAlready = false
    this.myGroups.some(function(a) {
      if (a.id == id)
      {
        iHaveDisAlready = true;
        return true;
      }
    });

    return (
      <TouchableHighlight
        key={id}
        onPress={this.joinGroup}
      >
        <View style={styles.groupContainer}>
          <Icon name="group" size={24} color={iHaveDisAlready ? 'red' : 'green'} />
          <View style={styles.groupTextContainer}>
            <View style={styles.groupTitleContainer}>
              <Text style={styles.groupName} numberOfLines={1}>{name}</Text>
              <Text style={styles.groupLastUpdated}>{id}</Text>
            </View>
            <Text style={styles.groupUsername}>{iHaveDisAlready ? 'Already a member' : 'Not a member'}
            </Text>
            <Text style={styles.groupText} numberOfLines={1}>
            </Text>
          </View>
        </View>
        </TouchableHighlight>
    );
  }
}

Group.propTypes = {
  joinGroup: PropTypes.func.isRequired,
  joinGroupQuery: PropTypes.func.isRequired,
  myGroups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

class AllGroups extends Component {
  static navigationOptions = {
    title: 'All Groups',
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

  renderItem = ({ item }) => <Group group={item} myGroups={this.props.user.groups} joinGroup={this.joinGroup} joinGroupQuery={this.props.groupUpdate}/>;

  joinGroup(group) {
    alert("User will be added to group, page wont refresh, TODO..fix this. YOLO")
    this.props.joinGroupQuery({group_id:group.id})

  }

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

    if (user && !user.organisation.groups) {
      return (
        <View style={styles.container}>
          <Text style={styles.warning}>{'no groups in this org'}</Text>
        </View>
      );
    }

    // render list of groups for user
    return (
      <View style={styles.container}>
        <FlatList
          data={user.organisation.groups}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          refreshing={networkStatus === 4}
        />
      </View>
    );
  }
}
AllGroups.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  groupUpdate: PropTypes.func,
  user: PropTypes.shape({
    organisation: PropTypes.shape({
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }),
      ),
    }),
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
};

const groupsQuery = graphql(ALL_GROUPS_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading, networkStatus, refetch, user,
  }),
});

const joinGroupQuery = graphql(JOIN_GROUP_QUERY, {
  props: ({ mutate }) => ({
    groupUpdate: ({ group_id}) =>
      mutate({
        variables: { groupUpdate: {group_id} },
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  groupsQuery,
  joinGroupQuery,
)(AllGroups);
