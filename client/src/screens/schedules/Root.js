import React, { Component } from 'react';
import { FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

import { Center, Container } from '../../components/Container';
import { ScheduleListItem } from '../../components/Schedules';
import { Progress } from '../../components/Progress';

class SchedulesRoot extends Component {
  static navigationOptions = () => ({
    title: 'My Availability',
  });

  onPressInfo = (item) => {
    this.props.navigation.push('SchedulesDetail', { id: item.id, title: item.name });
  };

  onRefresh = () => {
    this.props.refetch();
  }

  renderItem = ({ item }) => (
    <ScheduleListItem
      schedule={item}
      onPress={() => this.onPressInfo(item)}
    />
  );

  render() {
    const { loading, user } = this.props;

    if (loading || !user) {
      return (
        <Container>
          <Progress />
        </Container>
      );
    }

    // are they part of any groups?
    if (user.groups.length === 0) {
      return (
        <Container>
          <Center>
            <Text>You are not part of any groups.</Text>
          </Center>
        </Container>
      );
    }

    return (
      <Container>
        <FlatList
          data={user.schedules}
          ListHeaderComponent={() =>
            (!user.schedules.length ? (
              <Center>
                <Text>None of the groups you belong to have any open requests.</Text>
              </Center>
            ) : null)
          }
          keyExtractor={item => `schedule-${item.id}`}
          renderItem={this.renderItem}
          refreshing={this.props.networkStatus === 4}
          onRefresh={this.onRefresh}
        />
      </Container>
    );
  }
}

SchedulesRoot.propTypes = {
  loading: PropTypes.bool,
  navigation: PropTypes.shape({
    push: PropTypes.func,
  }),
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
            }),
          }),
        ),
      }),
    ),
  }),
};

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading,
    networkStatus,
    refetch,
    user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), userQuery)(SchedulesRoot);
