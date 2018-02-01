import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { SearchBar } from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import _ from 'lodash';

import { extendAppStyleSheet } from './style-sheet';
import ALL_GROUPS_QUERY from '../graphql/all-groups.query';

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
    this.navigation = this.props.navigation;
  }

  goToGroup = () => {
    const { navigate } = this.navigation;
    navigate('Group', { groupId: this.props.group.id });
  }

  render() {
    const { id, name } = this.props.group;
    const tags = this.props.group.tags.map(elem => `#${elem.name}`).join(',');
    this.state = {
      memberAlready: _.some(this.props.myGroups, g => g.id === this.props.group.id),
    };
    return (
      <TouchableHighlight key={id} onPress={this.goToGroup}>
        <View style={styles.groupContainer}>
          <Icon name={this.state.memberAlready ? 'users' : 'user-plus'} color={this.state.memberAlready ? 'orange' : 'green'} size={24} />
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
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
        id: PropTypes.number,
        name: PropTypes.string,
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

  onRefresh = () => {
    this.props.refetch();
  }

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <Group
      group={item}
      myGroups={this.props.user.groups}
      navigation={this.props.navigation}
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
        <SearchBar
          lightTheme
          onChangeText={null}
          onClearText={null}
          placeholder="Search Here...but dont expect anything to happen"
        />
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

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  groupsQuery,
)(AllGroups);
