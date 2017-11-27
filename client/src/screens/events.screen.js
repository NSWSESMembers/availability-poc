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
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import { extendAppStyleSheet } from './style-sheet';
import CURRENT_USER_QUERY from '../graphql/current-user.query';

const styles = extendAppStyleSheet({
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
    fontSize: 16,
  },
  eventTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  eventText: {
    color: '#8c8c8c',
    fontSize: 14,
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
    fontSize: 12,
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

const Header = ({ onPress }) => (
  <View style={styles.header}>
    <Button title="New Event" onPress={onPress} />
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
    const { id, name, time, details } = this.props.event;
    return (
      <TouchableHighlight
        key={id}
        onPress={this.goToEvent}
      >
        <View style={styles.eventContainer}>
          <Icon name="bullhorn" size={24} color="orange" />
          <View style={styles.eventTextContainer}>
            <View style={styles.eventTitleContainer}>
              <Text style={styles.eventName}>{name}</Text>
              <Text style={styles.eventLastUpdated}>{time}</Text>
            </View>
            <Text style={styles.eventText} numberOfLines={2}>{details}</Text>
          </View>
          <Icon
            name="angle-right"
            size={24}
            color="#8c8c8c"
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
    time: PropTypes.string,
    details: PropTypes.string,
  }),
};

class Events extends Component {
  static navigationOptions = {
    title: 'Events',
    tabBarIcon: ({ tintColor }) => <Icon size={26} name="bullhorn" color={tintColor} />,
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
    navigate('Event', { event, title: event.name });
  }

  goToNewEvent() {
    const { navigate } = this.props.navigation;
    navigate('NewEvent');
  }

  renderItem = ({ item }) => <Event event={item} goToEvent={this.goToEvent} />;

  render() {
    const { loading, user, networkStatus } = this.props;

    const events = [
      {
        id: 1,
        name: 'KMA Rescue - RCR',
        time: '3 mins ago',
        details: 'RCR at Princes Highway car vs truck. Lots of other really important details ' +
                 'about this job are right here and easily accessible.',
        responses: [
          {
            id: 6,
            user: {
              name: 'Alice Alpha',
            },
            status: 'Responding',
            detail: '10 mins from HQ',
          },
          {
            id: 7,
            user: {
              name: 'Bob Bravo',
            },
            status: 'Responding',
            detail: '25 mins from HQ',
          },
          {
            id: 9,
            user: {
              name: 'Charlie Charlie',
            },
            status: 'Unavailable',
            detail: 'At work',
          },
        ],
      },
      {
        id: 2,
        name: 'KMA Rescue - VR',
        time: '10 mins ago',
        details: 'Vertial rescue. 2 climbers stuck at bottom of Carrington falls',
        responses: [
          {
            id: 9,
            user: {
              name: 'Daniel Delta',
            },
            status: 'Responding',
            detail: '5 mins from HQ',
          },
          {
            id: 10,
            user: {
              name: 'Erin Echo',
            },
            status: 'Unavailable',
            detail: 'Busy',
          },
          {
            id: 11,
            user: {
              name: 'Felicity Foxtrot',
            },
            status: 'Tentative',
            detail: '45 mins until available',
          },
          {
            id: 12,
            user: {
              name: 'Gary Golf',
            },
            status: 'Responding',
            detail: 'At HQ',
          },
        ],
      },
    ];

    // render loading placeholder while we fetch messages
    if (loading || !user) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    if (!events.length) {
      return (
        <View style={styles.container}>
          <Header onPress={this.goToNewEvent} />
          <Text style={styles.warning}>You do not have any events.</Text>
        </View>
      );
    }

    // render list of events for user
    return (
      <View style={styles.container}>
        <FlatList
          data={events}
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
    username: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        details: PropTypes.string.isRequired,
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
)(Events);
