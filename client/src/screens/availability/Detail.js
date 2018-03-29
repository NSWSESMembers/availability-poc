import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

import { selectSchedules, scheduleLabel } from '../../selectors/schedules';
import { setSelectedDate, startWeekChange } from '../../state/availability.actions';

import { ButtonNavBar } from '../../components/Button';
import { Calendar, Week } from '../../components/Calendar';
import { Center, Container, Holder } from '../../components/Container';
import { DateRange } from '../../components/DateTime';
import { ListItem } from '../../components/List';
import { Progress } from '../../components/Progress';

class Detail extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: <ButtonNavBar onPress={() => navigation.navigate('Edit')} icon="plus" />,
    tabBarIcon: ({ tintColor }) => <Icon size={24} name="calendar" color={tintColor} />,
    tabBarLabel: 'Availability',
    title: 'Request Detail',
  });

  state = {
    showInfo: false,
  };

  onPressInfo = () => {
    this.setState({ showInfo: !this.state.showInfo });
  };

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
    const { loading, navigation, user } = this.props;

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
    const momentDate = moment.unix(this.props.selectedDate);

    // get start of week unix timestamp
    const startTime = momentDate
      .clone()
      .isoWeekday(1)
      .startOf('isoweek')
      .unix();

    const endTime = momentDate
      .clone()
      .isoWeekday(1)
      .endOf('isoweek')
      .unix();

    const schedule = user.schedules.filter(x => x.id === navigation.state.params.id)[0];

    const filteredItems = selectSchedules([schedule], { startTime, endTime });

    return (
      <Container>
        {schedule.startTime > 0 && (
          <Holder marginTop paddingVertical>
            <DateRange startTime={schedule.startTime} endTime={schedule.endTime} />
          </Holder>
        )}
        <ListItem
          title={schedule.name}
          subtitle={scheduleLabel(schedule.startTime, schedule.endTime)}
          onPress={() => this.onPressInfo(schedule)}
          icon={this.state.showInfo ? 'angle-up' : 'angle-down'}
          detail={this.state.showInfo ? schedule.details : undefined}
          wide
        />
        <Holder marginTop paddingVertical>
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
        {this.props.isChangingWeek && <Progress />}
        <Calendar items={filteredItems} onPressItem={this.onPressItem} />
      </Container>
    );
  }
}

Detail.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isChangingWeek: PropTypes.bool,
  loading: PropTypes.bool,
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setParams: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.object,
    }),
  }),
  selectedDate: PropTypes.number.isRequired,
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

const mapStateToProps = ({ auth, availability }) => ({
  auth,
  selectedDate: availability.selectedDate,
  isChangingWeek: availability.isChangingWeek,
});

export default compose(connect(mapStateToProps), userQuery)(Detail);
