import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Text } from 'react-native';

import { Center, Container } from '../../../components/Container';
import { Progress } from '../../../components/Progress';
import HomeEventListItem from './HomeEventListItem';
import HomeScheduleListItem from './HomeScheduleListItem';

class HomeList extends Component {
  onPressEvent = (event) => {
    const { homeNavigation } = this.props;
    homeNavigation.push('EventDetail', { eventId: event.id });
  };

  onPressNewEvent = (event) => {
    const { modalNavigation } = this.props;
    modalNavigation.push('EventNewResponse', { eventId: event.id });
  };

  onPressSchedule = (schedule) => {
    const { homeNavigation } = this.props;
    const { id, name } = schedule;
    homeNavigation.push('SchedulesDetail', { id, title: name });
  };

  getItemList() {
    const { events, schedules } = this.props.user;
    const items = [];

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

    return items;
  }

  renderItem = ({ item }) => {
    if (item.type === 'event') {
      return <HomeEventListItem event={item.event} onPress={this.onPressEvent} />;
    }
    if (item.type === 'new-event') {
      return <HomeEventListItem event={item.event} onPress={this.onPressNewEvent} urgent />;
    }
    if (item.type === 'schedule') {
      return <HomeScheduleListItem schedule={item.schedule} onPress={this.onPressSchedule} />;
    }
    throw Error(`Invalid type: ${item.type}`);
  };

  render() {
    const { loading, user, refreshing } = this.props;

    if (loading || !user) {
      return (
        <Container>
          <Progress />
        </Container>
      );
    }
    const items = this.getItemList(user);

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
          refreshing={refreshing}
          onRefresh={this.props.onRefresh}
        />
      </Container>
    );
  }
}

HomeList.propTypes = {
  loading: PropTypes.bool,
  onRefresh: PropTypes.func.isRequired,
  refreshing: PropTypes.bool,
  modalNavigation: PropTypes.shape({
    push: PropTypes.func,
  }),
  homeNavigation: PropTypes.shape({
    push: PropTypes.func,
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
    events: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
};

export default HomeList;
