import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql, compose } from 'react-apollo';
import { FlatList, Text } from 'react-native';
import { goToEvent, goToRequest } from '../../state/navigation.actions';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

import { scheduleLabel } from '../../selectors/schedules';

import { Center, Container } from '../../components/Container';
import { ListItem } from '../../components/List';
import { Progress } from '../../components/Progress';

const EventItem = ({ event, dispatch }) => (
  <ListItem
    title={event.name}
    bold
    subtitle={event.details}
    subtitleEllipsis
    icon="bullhorn"
    onPress={() => dispatch(goToEvent(event.id))}
  />
);

EventItem.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  dispatch: PropTypes.func.isRequired,
};

class ScheduleItem extends Component {
  onPress = (schedule) => {
    this.props.dispatch(goToRequest(schedule.id, schedule.name));
  };

  render() {
    const { schedule } = this.props;
    return (
      <ListItem
        title={schedule.name}
        bold
        subtitle={scheduleLabel(schedule.startTime, schedule.endTime)}
        icon="calendar"
        onPress={() => this.onPress(schedule)}
      />
    );
  }
}

ScheduleItem.propTypes = {
  schedule: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
  }),
  dispatch: PropTypes.func.isRequired,
};

class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({ tintColor }) => <Icon size={34} name="home" color={tintColor} />,
  };

  renderItem = ({ item }) => {
    if (item.type === 'event') {
      return <EventItem event={item.event} dispatch={this.props.dispatch} />;
    }
    if (item.type === 'schedule') {
      return <ScheduleItem schedule={item.schedule} dispatch={this.props.dispatch} />;
    }
    throw Error(`Invalid type: ${item.type}`);
  };

  render() {
    const { loading, user } = this.props;

    if (loading || !user) {
      return (
        <Container>
          <Progress />
        </Container>
      );
    }
    const items = [];
    user.events.forEach((e) => {
      items.push({
        type: 'event',
        id: e.id,
        event: e,
        sortKey: 0,
      });
    });
    user.schedules.forEach((s) => {
      items.push({
        type: 'schedule',
        id: s.id,
        schedule: s,
        sortKey: s.startTime,
      });
    });

    items.sort(i => i.sortKey);

    return (
      <Container>
        <FlatList
          data={items}
          ListHeaderComponent={() =>
            (!items.length ? (
              <Center>
                <Text>There is nothing interesting happening right now.</Text>
              </Center>
            ) : null)
          }
          keyExtractor={item => `${item.type}-${item.id}`}
          renderItem={this.renderItem}
          refreshing={this.props.networkStatus === 4}
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

Home.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
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

export default compose(connect(mapStateToProps), userQuery)(Home);
