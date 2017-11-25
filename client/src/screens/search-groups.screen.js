import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Alert,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import _ from 'lodash';

import { extendAppStyleSheet } from './style-sheet';
import ALL_GROUPS_QUERY from '../graphql/all-groups.query';
import JOIN_GROUP_MUTATION from '../graphql/join-group.mutation';

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

class Group extends Component {
  constructor(props) {
    super(props);
    this.myGroups = this.props.myGroups;
    this.joinGroup = this.joinGroup.bind(this);
    this.groupUpdate = this.props.groupUpdate.bind(this);
  }

  joinGroup() {
    const { groupUpdate, group } = this.props;
    groupUpdate({ groupId: group.id }).then(() => {
      // dont need to do anything, but we might in the future
    }).catch((error) => {
      Alert.alert(
        'Error Joining Group',
        error.message,
        [
          { text: 'OK', onPress: () => {} },
        ],
      );
    });
  }


  render() {
    const { id, name } = this.props.group;
    const tags = this.props.group.tags.map(elem => `#${elem.name}`).join(',');
    this.state = {
      memberAlready: _.some(this.props.myGroups, g => g.id === this.props.group.id),
    };
    return (
      <TouchableHighlight key={id} onPress={this.joinGroup}>
        <View style={styles.groupContainer}>
          <Icon name="group" size={24} color={this.state.memberAlready ? 'red' : 'green'} />
          <View style={styles.groupTextContainer}>
            <View style={styles.groupTitleContainer}>
              <Text style={styles.groupName} numberOfLines={1}>{name}</Text>
              <Text style={styles.groupLastUpdated}>{id}</Text>
            </View>
            <Text style={styles.groupText} numberOfLines={1}>{tags}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

Group.propTypes = {
  groupUpdate: PropTypes.func.isRequired,
  myGroups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
};

class AllGroups extends Component {
  static navigationOptions = {
    title: 'All Groups',
    tabBarIcon: ({ tintColor }) => (
      <Icon size={24} name="group" color={tintColor} />
    ),
  };

  constructor(props) {
    super(props);
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.props.refetch();
  }

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <Group
      group={item}
      myGroups={this.props.user.groups}
      groupUpdate={this.props.groupUpdate}
    />
  );

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

    if (user && !user.organisation.groups.length) {
      return (
        <View style={styles.container}>
          <Text style={styles.warning}>
            There are no groups in this organisation
          </Text>
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
          extraData={user} // redraw if this changes
          refreshing={networkStatus === 4}
        />
      </View>
    );
  }
}
AllGroups.propTypes = {
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  groupUpdate: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    organisation: PropTypes.shape({
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          tags: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              name: PropTypes.string.isRequired,
            }),
          ),
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

const joinGroupMutation = graphql(JOIN_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    groupUpdate: ({ groupId }) =>
      mutate({
        variables: { groupUpdate: { groupId } },
        update: (store, { data: { addUserToGroup } }) => {
          // fetch data from the cache
          const data = store.readQuery({
            query: ALL_GROUPS_QUERY,
          });
          // add new data to the cache
          data.user.groups.push(addUserToGroup);
          // write out cache
          store.writeQuery({
            query: ALL_GROUPS_QUERY,
            data,
          });
        },
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  groupsQuery,
  joinGroupMutation,
)(AllGroups);
