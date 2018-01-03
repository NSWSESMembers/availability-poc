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

import distantFuture from '../constants';
import { extendAppStyleSheet } from './style-sheet';
import SEARCH_SCHEDULE_QUERY from '../graphql/search-schedules.query';

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

const ScheduleHeader = (props) => {
  const { name, details } = props.schedule;

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerName} numberOfLines={1}>{name}</Text>
          <Text style={styles.headerDetail} numberOfLines={3}>{details}</Text>
        </View>
      </View>
    </View>
  );
};
ScheduleHeader.propTypes = {
  schedule: PropTypes.shape({
    name: PropTypes.string,
    details: PropTypes.string,
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

const UsersDisplay = (props) => {
  console.log(props);
  const { id, username } = props.user;
  return (
    <TouchableHighlight key={id}>
      <View style={styles.groupContainer}>
        <Icon name="user" size={24} color="blue" />
        <View style={styles.groupTextContainer}>
          <View style={styles.groupTitleContainer}>
            <Text style={styles.groupName} numberOfLines={1}>{username}</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};
UsersDisplay.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }),
};

class Schedule extends Component {
  static navigationOptions = {
    title: 'Schedule',
    tabBarIcon: ({ tintColor }) => (
      <Icon size={24} name="Schedule" color={tintColor} />
    ),
  };

  constructor(props) {
    super(props);
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.props.refetch();
  }

  keyExtractor = (item) => {
    if (item.length === 1 || item[0] === 'section') {
      return item[1];
    }
    return [item[0], item[1].id];
  }
  renderItem = ({ item }) => {
    console.log(item);
    if (item[0] === 'info') {
      return <ScheduleHeader schedule={item[1]} />;
    }

    if (item[0] === 'section') {
      return <SectionHeader section={item[1]} />;
    }

    if (item[0] === 'user') {
      return <UsersDisplay user={item[1]} />;
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

    const schedule = this.props.user.schedules[0];

    // somehow we got here with no group
    if (!schedule) {
      return <Text>Error displaying shedule</Text>;
    }

    const users = [];
    _.forEach(schedule.timeSegments, (segment) => {
      let duplicate = false;
      _.forEach(users, (usr) => {
        if (segment.user.username === usr.username) {
          duplicate = true;
        }
      });
      if (!duplicate) {
        users.push({ username: segment.user.username, id: segment.user.id });
      }
    });


    const rows = [
      ['info', schedule],
    ].concat(
      _.map(['Users who have answered'], r => ['section', r]),
      _.map(users, r => ['user', r]),
    );

    // render stuff
    return (
      <View style={styles.container}>
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
Schedule.propTypes = {
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    schedules: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        details: PropTypes.string.isRequired,
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
        timeSegments: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            status: PropTypes.string.isRequired,
            startTime: PropTypes.number.isRequired,
            endTime: PropTypes.number.isRequired,
            user: PropTypes.shape({
              id: PropTypes.number.isRequired,
              username: PropTypes.string.isRequired,
            }),
          }),
        ),
      }),
    ),
  }),
};

const scheduleQuery = graphql(SEARCH_SCHEDULE_QUERY, {
  options: ownProps => ({
    variables: {
      scheduleId: ownProps.navigation.state.params.scheduleId,
    },
  }),
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading, networkStatus, refetch, user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  scheduleQuery,
)(Schedule);
