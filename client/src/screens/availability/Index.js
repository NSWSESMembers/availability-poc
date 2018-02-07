import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/FontAwesome';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

import { ButtonNavBar } from '../../components/Button';
import { Calendar, Week } from '../../components/Calendar';
import { Center, Container, Holder } from '../../components/Container';
import { Progress } from '../../components/Progress';
import { SeparatorClear } from '../../components/Separator';

import { setSelectedDate, startWeekChange } from '../../state/availability.actions';

class Index extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Availability',
    tabBarIcon: ({ tintColor }) => <Icon size={24} name="calendar" color={tintColor} />,
    headerRight: <ButtonNavBar onPress={() => navigation.navigate('Edit')} icon="plus" />,
  });

  onChangeDate = (dt) => {
    this.props.dispatch(setSelectedDate(dt.unix()));
  };

  onPressItem = (timeSegment) => {
    this.props.navigation.navigate('Edit', { timeSegment });
  };

  onScrollEnd = (e) => {
    this.props.dispatch(startWeekChange());
    const { layoutMeasurement, contentOffset } = e.nativeEvent;
    const activeIndex = Math.floor(contentOffset.x / layoutMeasurement.width);

    let dt;
    if (activeIndex === -1) {
      dt = moment
        .unix(this.props.selectedDate)
        .add(-1, 'weeks')
        .startOf('isoWeek');
    } else {
      dt = moment
        .unix(this.props.selectedDate)
        .add(1, 'weeks')
        .startOf('isoWeek');
    }
    this.props.dispatch(setSelectedDate(dt.unix()));
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

    // do any of the groups have schedules?
    // expands to check date range of requests
    if (user.schedules.length === 0) {
      return (
        <Container>
          <Center>
            <Text>None of the groups you belong to have any open requests.</Text>
          </Center>
        </Container>
      );
    }

    // move to redux filters alter
    const momentDate = moment.unix(this.props.selectedDate);

    // get start of week unix timestamp
    const startOfWeek = momentDate
      .clone()
      .isoWeekday(1)
      .startOf('isoweek')
      .unix();

    const endOfWeek = momentDate
      .clone()
      .isoWeekday(1)
      .endOf('isoweek')
      .unix();

    const filteredItems = [];
    _.forEach(user.schedules, (schedule) => {
      _.forEach(schedule.timeSegments, (timeSegment) => {
        if (
          (timeSegment.startTime === 0 || timeSegment.startTime > startOfWeek) &&
          (timeSegment.endTime === 2147483647 || timeSegment.endTime < endOfWeek)
        ) {
          filteredItems.push({
            requestId: schedule.id,
            requestName: schedule.name,
            requestDetail: schedule.details,
            startTime: timeSegment.startTime,
            endTime: timeSegment.endTime,
            id: timeSegment.id,
            status: timeSegment.status,
          });
        }
      });
    });

    filteredItems.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));

    return (
      <Container>
        <Holder margin>
          <ScrollView
            horizontal
            onScrollEndDrag={this.onScrollEnd}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Week
              onChangeDate={this.onChangeDate}
              selectedDate={moment.unix(this.props.selectedDate)}
            />
          </ScrollView>
        </Holder>
        <SeparatorClear />
        {this.props.isChangingWeek && <Progress />}
        <Calendar items={filteredItems} onPressItem={this.onPressItem} />
      </Container>
    );
  }
}

Index.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setParams: PropTypes.func,
  }),
  dispatch: PropTypes.func.isRequired,
  selectedDate: PropTypes.number.isRequired,
  isChangingWeek: PropTypes.bool,
  loading: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
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
            }),
          ),
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
                  status: PropTypes.number.isRequired,
                  startTime: PropTypes.number.isRequired,
                  endTime: PropTypes.number.isRequired,
                  user: PropTypes.arrayOf(
                    PropTypes.shape({
                      id: PropTypes.number.isRequired,
                    }),
                  ),
                }),
              ),
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

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading,
    networkStatus,
    refetch,
    user,
  }),
});

const mapStateToProps = ({ auth, availability }) => ({
  auth,
  selectedDate: availability.selectedDate,
  isChangingWeek: availability.isChangingWeek,
  items: availability.items,
});

export default compose(connect(mapStateToProps), userQuery)(Index);
