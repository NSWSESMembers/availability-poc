import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { FlatList, Text, Button } from 'react-native';
import { withNavigation } from 'react-navigation';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

import { Center, Container } from '../../components/Container';
import { Progress } from '../../components/Progress';
import EventListItem from '../../components/Events/EventListItem';
import ScheduleListItem from '../../components/Schedules/ScheduleListItem';


class _HomeEventListItem extends Component {
  onPress = () => {
    const { event, navigation } = this.props;
    navigation.push('EventDetail', { eventId: event.id });
  }

  render() {
    return (
      <EventListItem event={this.props.event} onPress={this.onPress} />
    );
  }
}
_HomeEventListItem.propTypes = {
  event: PropTypes.shape().isRequired,
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};
const HomeEventListItem = withNavigation(_HomeEventListItem);

class _HomeNewEventListItem extends Component {
  onPress = () => {
    const { event, modalNavigation } = this.props;
    modalNavigation.push('EventNewResponse', { eventId: event.id });
  }

  render() {
    return (
      <EventListItem event={this.props.event} onPress={this.onPress} urgent />
    );
  }
}
_HomeNewEventListItem.propTypes = {
  event: PropTypes.shape().isRequired,
  modalNavigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};
const HomeNewEventListItem = withNavigation(_HomeNewEventListItem);

class _HomeScheduleListItem extends Component {
  onPress = () => {
    const { schedule: { id, name }, navigation } = this.props;
    navigation.push('SchedulesDetail', { id, title: name });
  }

  render() {
    return (
      <ScheduleListItem schedule={this.props.schedule} onPress={this.onPress} />
    );
  }
}
_HomeScheduleListItem.propTypes = {
  schedule: PropTypes.shape().isRequired,
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};
const HomeScheduleListItem = withNavigation(_HomeScheduleListItem);

class HomeRoot extends Component {
  static navigationOptions = () => ({
    title: 'Home',
  });

  onRefresh = () => {
    this.props.refetch();
  };

  renderItem = ({ item }) => {
    if (item.type === 'event') {
      return <HomeEventListItem event={item.event} />;
    }
    if (item.type === 'new-event') {
      return (
        <HomeNewEventListItem
          event={item.event}
          modalNavigation={this.props.screenProps.modalNavigation}
        />
      );
    }
    if (item.type === 'schedule') {
      return <HomeScheduleListItem schedule={item.schedule} />;
    }
    throw Error(`Invalid type: ${item.type}`);
  };

  render() {
    const { loading, user } = this.props;

    if (loading || !user) {
      return (
        <Container>
          <Progress />
          <Button title="reload" onPress={() => this.props.refetch()} />
        </Container>
      );
    }
    const items = [];
    const { events, schedules } = user;
    const oneEvent = [];
    if (events.length > 0) {
      oneEvent.push(events[Math.floor(Math.random() * events.length)]);
    }

    // here we create 2 entries for every event to show the difference between new events and
    // ones the user has already responded to
    events.forEach((e) => {
      items.push({
        type: 'event',
        id: e.id,
        event: e,
        sortKey: 1,
      });
    });
    oneEvent.forEach((e) => {
      items.push({
        type: 'new-event',
        id: e.id,
        event: e,
        sortKey: 0,
      });
    });
    schedules.forEach((s) => {
      items.push({
        type: 'schedule',
        id: s.id,
        schedule: s,
        sortKey: s.startTime,
      });
    });

    items.sort(i => i.sortKey);

    if (items.length === 0) {
      return (
        <Container>
          <Center>
            <Text>There is nothing interesting happening right now.</Text>
          </Center>
        </Container>
      );
    }

    return (
      <Container>
        <FlatList
          data={items}
          keyExtractor={item => `${item.type}-${item.id}`}
          renderItem={this.renderItem}
          refreshing={this.props.networkStatus === 4}
          onRefresh={this.onRefresh}
        />
      </Container>
    );
  }
}

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading,
    networkStatus,
    refetch,
    user,
  }),
});

HomeRoot.propTypes = {
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  screenProps: PropTypes.shape({
    modalNavigation: PropTypes.shape({
      push: PropTypes.func,
    }),
  }),
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
      }),
    ),
  }),
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), userQuery)(HomeRoot);
