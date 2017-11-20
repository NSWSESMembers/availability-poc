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
import CURRENT_USER_QUERY from '../graphql/current-user.query';

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
    <Button title={'Create New Group'} onPress={onPress} />
    <Button title={'Find & Join Groups'} onPress={onPressFind} />
  </View>
);
Header.propTypes = {
  onPress: PropTypes.func.isRequired,
  onPressFind: PropTypes.func.isRequired,
};

class Group extends Component {
  constructor(props) {
    super(props);
    this.goToGroup = this.props.goToGroup.bind(this, this.props.group);
  }

  render() {
    const { id, name } = this.props.group;
    const tags = (this.props.group.tags.map((elem) => {return '#'+elem.name})).join(',')

    return (
      <TouchableHighlight
        key={id}
        onPress={this.goToGroup}
      >
        <View style={styles.groupContainer}>
          <Icon name="group" size={24} color={'orange'} />
          <View style={styles.groupTextContainer}>
            <View style={styles.groupTitleContainer}>
              <Text style={styles.groupName} numberOfLines={1}>{name}</Text>
              <Text style={styles.groupLastUpdated}>{id}</Text>
            </View>
            <Text style={styles.groupText} numberOfLines={1}>{tags}
            </Text>
          </View>
          <Icon
            name="angle-right"
            size={24}
            color={'#8c8c8c'}
          />
        </View>
      </TouchableHighlight>
    );
  }
}

Group.propTypes = {
  goToGroup: PropTypes.func.isRequired,
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

class Groups extends Component {
  static navigationOptions = {
    title: 'Groups',
    tabBarIcon: ({ tintColor}) => <Icon size={24} name={'group'} color={tintColor} />
  };

  constructor(props) {
    super(props);
    this.goToGroup = this.goToGroup.bind(this);
    this.goToNewGroup = this.goToNewGroup.bind(this);
    this.goToSearchGroup = this.goToSearchGroup.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.props.refetch();
  }

  keyExtractor = item => item.id;

  goToGroup(group) {
    const { navigate } = this.props.navigation;
    const tags = (group.tags.map((elem) => {return '#'+elem.name})).join(',')

    navigate('Group', { groupId: group.id, title: group.name, tags: tags });
  }

  goToNewGroup() {
    const { navigate } = this.props.navigation;
    navigate('NewGroup');
  }

  goToSearchGroup() {
    const { navigate } = this.props.navigation;
    navigate('SearchGroup');
  }

  renderItem = ({ item }) => <Group group={item} goToGroup={this.goToGroup} />;

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

    if (user && !user.groups.length) {
      return (
        <View style={styles.container}>
          <Header onPress={this.goToNewGroup} onPressFind={this.goToSearchGroup}/>
          <Text style={styles.warning}>{'You are not a member of any groups.'}</Text>
        </View>
      );
    }

    // render list of groups for user
    return (
      <View style={styles.container}>
        <FlatList
          data={user.groups}
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
Groups.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
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
};

const userQuery = graphql(CURRENT_USER_QUERY, {
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
  userQuery,
)(Groups);
