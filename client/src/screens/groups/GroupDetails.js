import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  View,
  Button,
  Alert,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

import distantFuture from '../../constants';
import { extendAppStyleSheet } from '../style-sheet';
import SEARCH_GROUP_QUERY from '../../graphql/search-group.query';
import JOIN_GROUP_MUTATION from '../../graphql/join-group.mutation';
import LEAVE_GROUP_MUTATION from '../../graphql/leave-group.mutation';
import CURRENT_USER_QUERY from '../../graphql/current-user.query';

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
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  sectionTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
    backgroundColor: '#eee',
  },
  headerName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  groupName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
  groupTitleContainer: {
    flexDirection: 'row',
  },
  groupTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  eventContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  eventName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
  eventTitleContainer: {
    flexDirection: 'row',
  },
  eventTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  eventText: {
    color: '#8c8c8c',
  },
  scheduleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scheduleName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
  scheduleTitleContainer: {
    flexDirection: 'row',
  },
  scheduleTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  scheduleText: {
    color: '#8c8c8c',
  },
});

const GroupHeader = (props) => {
  const { name, tags } = props.group;
  const tagWord = tags.map(elem => `#${elem.name}`).join(' ');

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerName} numberOfLines={1}>{name}</Text>
          <Text style={styles.headerDetail} numberOfLines={3}>{tagWord}</Text>
        </View>
      </View>
    </View>
  );
};
GroupHeader.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
};

const SectionHeader = (props) => {
  const { section } = props;

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.sectionTextContainer}>
          <Text style={styles.headerName} numberOfLines={1}>{section}</Text>
        </View>
      </View>
    </View>
  );
};
SectionHeader.propTypes = {
  section: PropTypes.string,
};

const MembersDisplay = (props) => {
  const { id, displayName } = props.member;
  return (
    <TouchableHighlight key={id}>
      <View style={styles.groupContainer}>
        <Icon name="user" size={24} color="blue" />
        <View style={styles.groupTextContainer}>
          <View style={styles.groupTitleContainer}>
            <Text style={styles.groupName} numberOfLines={1}>{displayName}</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};
MembersDisplay.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.number.isRequired,
    displayName: PropTypes.string.isRequired,
  }),
};

const EventsDisplay = (props) => {
  const { id, name, details } = props.event;
  return (
    <TouchableHighlight key={id}>
      <View style={styles.eventContainer}>
        <Icon name="bullhorn" size={24} color="blue" />
        <View style={styles.eventTextContainer}>
          <View style={styles.eventTitleContainer}>
            <Text style={styles.eventName} numberOfLines={1}>{name}</Text>
          </View>
          <Text style={styles.eventText} numberOfLines={1}>{details}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};
EventsDisplay.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

const ScheduleDisplay = (props) => {
  const { id, name, details, startTime, endTime } = props.schedule;
  let timeText = '';
  if (startTime === 0 && endTime === distantFuture) {
    timeText = 'Perpetual Schedule';
  } else {
    const startText = moment.unix(startTime).format('DD/MM/YY, HH:mm:ss');
    const endText = moment.unix(endTime).format('DD/MM/YY, HH:mm:ss');
    timeText = `${startText} - ${endText}`;
  }
  return (
    <TouchableHighlight key={id}>
      <View style={styles.scheduleContainer}>
        <Icon name="calendar" size={24} color="blue" />
        <View style={styles.scheduleTextContainer}>
          <View style={styles.groupTitleContainer}>
            <Text style={styles.scheduleName} numberOfLines={1}>{name} - {timeText}</Text>
          </View>
          <Text style={styles.scheduleText} numberOfLines={1}>{details}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};
ScheduleDisplay.propTypes = {
  schedule: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
  }),
};

class Group extends Component {
  static navigationOptions = () => ({
    title: 'Group Details',
    tabBarLabel: 'Groups',
    tabBarIcon: ({ tintColor }) => <Icon size={24} name="group" color={tintColor} />,
  });

  onRefresh = () => {
    this.props.refetch();
  }

  getGroup = () => this.props.user.organisation.groups[0];

  joinGroup = () => {
    this.props.joinGroupQry({ groupId: this.getGroup().id }).catch((error) => {
      Alert.alert(
        'Error Joining Group',
        error.message,
        [
          { text: 'OK', onPress: () => {} },
        ],
      );
    });
  }

  leaveGroup = () => {
    this.props.leaveGroupQry({ groupId: this.getGroup().id }).then(() => {
    }).catch((error) => {
      Alert.alert(
        'Error Leaving Group',
        error.message,
        [
          { text: 'OK', onPress: () => {} },
        ],
      );
    });
  }

  keyExtractor = (item) => {
    if (item.length === 1 || item[0] === 'section') {
      return item[1];
    }
    return [item[0], item[1].id];
  }
  renderItem = ({ item }) => {
    if (item[0] === 'info') {
      return <GroupHeader group={item[1]} />;
    }

    if (item[0] === 'section') {
      return <SectionHeader section={item[1]} />;
    }

    if (item[0] === 'user') {
      return <MembersDisplay member={item[1]} />;
    }

    if (item[0] === 'schedule') {
      return <ScheduleDisplay schedule={item[1]} />;
    }

    if (item[0] === 'event') {
      return <EventsDisplay event={item[1]} />;
    }

    throw Error(`Tried to render invalid item type: ${item[0]}`);
  };

  render() {
    const { loading, user, networkStatus } = this.props;
    if (loading || !user) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    const group = this.props.user.organisation.groups[0];
    const me = this.props.user;

    // somehow we got here with no group
    if (!group) {
      return <Text>Error displaying group</Text>;
    }

    const rows = [
      ['info', group],
    ].concat(
      _.map(['Users'], r => ['section', r]),
      _.map(group.users, r => ['user', r]),
      _.map(['Events'], r => ['section', r]),
      _.map(group.events, r => ['event', r]),
      _.map(['Schedules'], r => ['section', r]),
      _.map(group.schedules, r => ['schedule', r]),
    );
    // render group stuff

    const memberAlready = _.some(group.users, g => g.id === me.id);

    return (
      <View style={styles.container}>
        <Button
          title={memberAlready ? 'Leave Group' : 'Join Group'}
          onPress={memberAlready ? this.leaveGroup : this.joinGroup}
        />
        <FlatList
          data={rows}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          refreshing={networkStatus === 4}
        />
      </View>
    );
  }
}
Group.propTypes = {
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  joinGroupQry: PropTypes.func,
  leaveGroupQry: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
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
          users: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              username: PropTypes.string.isRequired,
              displayName: PropTypes.string.isRequired,
            }),
          ),
          schedules: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              name: PropTypes.string.isRequired,
              details: PropTypes.string.isRequired,
              startTime: PropTypes.number.isRequired,
              endTime: PropTypes.number.isRequired,
            }),
          ),
          events: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              name: PropTypes.string.isRequired,
              details: PropTypes.string.isRequired,
            }),
          ),
        }),
      ),
    }),
  }),
};

const groupQuery = graphql(SEARCH_GROUP_QUERY, {
  options: ownProps => ({
    variables: {
      groupId: ownProps.navigation.state.params.groupId,
    },
  }),
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading, networkStatus, refetch, user,
  }),
});

const joinGroupMutation = graphql(JOIN_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    joinGroupQry: ({ groupId }) =>
      mutate({
        variables: { groupUpdate: { groupId } },
        update: (store, { data: { addUserToGroup } }) => {
          // fetch data from the cache
          const data = store.readQuery({
            query: CURRENT_USER_QUERY,
          });
          // add new data to the cache
          data.user.groups.push(addUserToGroup);
          data.user.schedules = _.merge(data.user.schedules, addUserToGroup.schedules);
          data.user.events = _.merge(data.user.events, addUserToGroup.events);
          // write out cache
          store.writeQuery({
            query: CURRENT_USER_QUERY,
            data,
          });
        },
      }),
  }),
});

const leaveGroupMutation = graphql(LEAVE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    leaveGroupQry: ({ groupId }) =>
      mutate({
        variables: { groupUpdate: { groupId } },
        refetchQueries: [{
          query: CURRENT_USER_QUERY,
        }],
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  groupQuery,
  joinGroupMutation,
  leaveGroupMutation,
)(Group);
