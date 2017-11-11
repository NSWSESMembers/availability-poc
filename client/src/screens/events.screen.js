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

import { USER_QUERY } from '../graphql/user.query';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
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
  eventTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  eventText: {
    color: '#8c8c8c',
  },
  eventImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  eventTitleContainer: {
    flexDirection: 'row',
  },
  eventLastUpdated: {
    flex: 0.3,
    color: '#8c8c8c',
    fontSize: 11,
    textAlign: 'right',
  },
  eventUsername: {
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

// format createdAt with moment
const formatCreatedAt = createdAt => moment(createdAt).calendar(null, {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: 'dddd',
  sameElse: 'DD/MM/YYYY',
});

const Header = ({ onPress }) => (
  <View style={styles.header}>
    <Button title={'New Event'} onPress={onPress} />
  </View>
);
Header.propTypes = {
  onPress: PropTypes.func.isRequired,
};

class Event extends Component {
  constructor(props) {
    super(props);

    this.goToEvent = this.props.goToEvent.bind(this, this.props.event);
  }

  render() {
    const { id, details } = this.props.event;
    return (
      <TouchableHighlight
        key={id}
        onPress={this.goToMessages}
      >
        <View style={styles.eventContainer}>
          <Icon name="bullhorn" size={24} color={'orange'} />
          <View style={styles.eventTextContainer}>
            <View style={styles.eventTitleContainer}>
              <Text style={styles.eventName}>{details}</Text>
              <Text style={styles.eventLastUpdated}>{id}</Text>
            </View>
            <Text style={styles.eventUsername}>
            </Text>
            <Text style={styles.eventText} numberOfLines={1}>
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

Event.propTypes = {
  goToEvent: PropTypes.func.isRequired,
  event: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

class Events extends Component {
  static navigationOptions = {
    title: 'Events',
    tabBarIcon: ({ tintColor}) => <Icon size={26} name={'bullhorn'} color={tintColor} />
  };

  constructor(props) {
    super(props);
    this.goToEvent = this.goToEvent.bind(this);
    this.goToNewEvent = this.goToNewEvent.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.props.refetch();
  }

  keyExtractor = item => item.id;

  goToEvent(event) {
    const { navigate } = this.props.navigation;
  navigate('Messages', { eventId: event.id, title: event.name });
  }

  goToNewEvent() {
    const { navigate } = this.props.navigation;
    navigate('NewEvent');
  }

  renderItem = ({ item }) => <Event event={item} goToEvent={this.goToEvent} />;

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

    if (user && !user.events.length) {
      return (
        <View style={styles.container}>
          <Header onPress={this.goToNewEvent} />
          <Text style={styles.warning}>{'You do not have any events.'}</Text>
        </View>
      );
    }

    // render list of events for user
    return (
      <View style={styles.container}>
        <FlatList
          data={user.events}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListHeaderComponent={() => <Header onPress={this.goToNewEvent} />}
          onRefresh={this.onRefresh}
          refreshing={networkStatus === 4}
        />
      </View>
    );
  }
}
Events.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        details: PropTypes.string.isRequired,
      }),
    ),
  }),
};

const userQuery = graphql(USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.jwt,
  options: ownProps => ({ variables: { id: ownProps.auth.id } }),
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
)(Events);
