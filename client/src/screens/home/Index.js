import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql, compose } from 'react-apollo';
import { FlatList, Text, View } from 'react-native';
import moment from 'moment';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

import { Center, Container, Holder } from '../../components/Container';
import { ListItem } from '../../components/List';
import { Progress } from '../../components/Progress';
import { Segment } from '../../components/Segment';

class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({ tintColor }) => <Icon size={34} name="home" color={tintColor} />,
  };

  state = {
    selectedIndex: 0,
  };

  handleNavigate = () => {
    this.props.navigation.navigate('Edit');
  };

  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  };

  handleEventPress = (event) => {
    this.props.navigation.navigate('Event', { id: event.item.id, title: event.item.name });
  };

  handleSchedulePress = () => {
    this.props.navigation.navigate('Availability');
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

    return (
      <Container>
        <Holder margin marginBot transparent>
          <Segment
            values={['Events', 'Requests']}
            handleIndexChange={this.handleIndexChange}
            selectedIndex={this.state.selectedIndex}
          />
        </Holder>
        {this.state.selectedIndex === 0 ? (
          <View style={{ flexDirection: 'row' }}>
            <FlatList
              data={user.events}
              ListHeaderComponent={() =>
                (!user.events.length ? (
                  <Center>
                    <Text>There are no events currently.</Text>
                  </Center>
                ) : null)}
              keyExtractor={event => event.id}
              renderItem={event => (
                <ListItem
                  title={event.item.name}
                  icon="bullhorn"
                  onPress={() => this.handleEventPress(event)}
                />
              )}
              refreshing={this.props.networkStatus === 4}
            />
          </View>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <FlatList
              data={user.schedules}
              ListHeaderComponent={() =>
                (!user.schedules.length ? (
                  <Center>
                    <Text>There are no requests available. Make sure you have joined a group.</Text>
                  </Center>
                ) : null)}
              keyExtractor={schedule => schedule.id}
              renderItem={schedule => (
                <ListItem
                  title={schedule.item.name}
                  subtitle={
                    schedule.item.startTime === 0
                      ? 'Ongoing'
                      : `${moment
                          .unix(schedule.item.startTime)
                          .format('YYYY-MM-DD')} to ${moment
                          .unix(schedule.item.endTime)
                          .format('YYYY-MM-DD')}`
                  }
                  icon="calendar"
                  onPress={() => this.handleSchedulePress(schedule)}
                />
              )}
              refreshing={this.props.networkStatus === 4}
            />
          </View>
        )}
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
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
