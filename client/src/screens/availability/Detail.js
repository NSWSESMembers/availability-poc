import React, { Component } from 'react';
import { Switch, Text, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

import {
  CREATE_TIME_SEGMENT_MUTATION,
  REMOVE_TIME_SEGMENT_MUTATION,
  UPDATE_TIME_SEGMENT_MUTATION,
} from '../../graphql/time-segment.mutation';

import { selectSchedules } from '../../selectors/schedules';

import { Button, ButtonBox, ButtonNavBar } from '../../components/Button';
import { Center, Container, Holder } from '../../components/Container';
import { DateRange } from '../../components/DateTime';
import { Progress } from '../../components/Progress';

class Detail extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: <ButtonNavBar onPress={() => navigation.navigate('Edit')} icon="info" />,
    tabBarIcon: ({ tintColor }) => <Icon size={24} name="calendar" color={tintColor} />,
    tabBarLabel: 'Availability',
    title:
      typeof navigation.state.params === 'undefined' ||
      typeof navigation.state.params.title === 'undefined'
        ? 'Request Detail'
        : navigation.state.params.title,
  });

  state = {
    allDay: true,
    editDay: 0,
    selectedDays: [],
    selectedType: '',
    showInfo: false,
  };

  componentWillMount() {
    const schedule = this.props.user.schedules.filter(
      x => x.id === this.props.navigation.state.params.id,
    )[0];
    this.props.navigation.setParams({ title: schedule.name });
  }

  onPressEdit = () => {
    const schedule = this.props.user.schedules.filter(
      x => x.id === this.props.navigation.state.params.id,
    )[0];

    if (this.state.editDay > 0) {
      // Update
      const results = schedule.timeSegments.filter(x => x.startTime === this.state.editDay);

      if (results.length > 0) {
        this.props
          .updateTimeSegment({
            segmentId: results[0].id,
            status: this.state.selectedType,
            startTime: results[0].startTime,
            endTime: results[0].endTime,
          })
          .then(() => {
            setTimeout(() => {
              this.setState({ selectedDays: [], selectedType: '', allDay: true, editDay: 0 });
            }, 250);
          });
      }
    } else {
      // Add
      this.state.selectedDays.forEach((day) => {
        const dayUnix = 24 * 60 * 60;
        let endOfDay = parseInt(day, 0) + dayUnix;
        endOfDay -= 1;
        this.props
          .createTimeSegment({
            scheduleId: schedule.id,
            status: this.state.selectedType,
            startTime: day,
            endTime: endOfDay,
          })
          .then(() => {
            this.setState({ selectedDays: [], selectedType: '', allDay: true, editDay: 0 });
          });
      });
    }
  };

  onPressDelete = () => {
    const schedule = this.props.user.schedules.filter(
      x => x.id === this.props.navigation.state.params.id,
    )[0];

    if (this.state.editDay > 0) {
      // Update
      const results = schedule.timeSegments.filter(x => x.startTime === this.state.editDay);

      if (results.length > 0) {
        this.props
          .removeTimeSegment({
            segmentId: results[0].id,
          })
          .then(() => {
            setTimeout(() => {
              this.setState({ selectedDays: [], selectedType: '', allDay: true, editDay: 0 });
            }, 250);
          });
      }
    }
  };

  onPressType = (selectedType) => {
    if (selectedType === this.state.selectedType) {
      this.setState({ selectedType: '' });
    } else {
      this.setState({ selectedType });
    }
  };

  onPressInfo = () => {
    this.setState({ showInfo: !this.state.showInfo });
  };

  onEditDay = (date) => {
    const schedule = this.props.user.schedules.filter(
      x => x.id === this.props.navigation.state.params.id,
    )[0];

    const results = schedule.timeSegments.filter(x => x.startTime === date);

    if (results.length > 0) {
      this.setState({ selectedType: results[0].status });
    }
    // const selectedSegments = schedule.TimeSegments.filter(segment => segment.startTime === date);

    // console.log(selectedSegments);
    if (date === this.state.editDay) {
      this.setState({ editDay: 0 });
    } else {
      this.setState({ editDay: date });
    }
  };

  onSelectDay = (date) => {
    // is day already entered?

    let newArray = this.state.selectedDays.slice();
    if (newArray.indexOf(date) !== -1) {
      // remove
      newArray = newArray.filter(d => d !== date);
    } else {
      // add
      newArray.push(date);
    }
    this.setState({ selectedDays: newArray });
  };

  onTimeChange = () => {
    this.setState({ allDay: !this.state.allDay });
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
            <DateRange
              startTime={schedule.startTime}
              endTime={schedule.endTime}
              onSelect={this.onSelectDay}
              onEdit={this.onEditDay}
              editDay={this.state.editDay}
              selectedDays={this.state.selectedDays}
              timeSegments={filteredItems}
            />
          </Holder>
        )}

        {this.state.selectedDays.length === 0 && this.state.editDay === 0 ? (
          <Holder marginTop paddingVertical>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text>Tap days to edit.</Text>
            </View>
          </Holder>
        ) : (
          <View>
            {this.state.editDay !== 0 && (
              <Holder marginTop paddingVertical>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text>{moment.unix(this.state.editDay).format('LL')}</Text>
                </View>
              </Holder>
            )}
            <Holder marginTop paddingVertical>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ButtonBox
                  text="Available"
                  onPress={() => this.onPressType('Available')}
                  selected={this.state.selectedType === 'Available'}
                  selectedColor="green"
                />
                <ButtonBox
                  text="Unavailable"
                  onPress={() => this.onPressType('Unavailable')}
                  selected={this.state.selectedType === 'Unavailable'}
                  selectedColor="red"
                />
                <ButtonBox
                  text="Urgent"
                  onPress={() => this.onPressType('Urgent')}
                  selected={this.state.selectedType === 'Urgent'}
                  selectedColor="orange"
                />
              </View>
            </Holder>
            {this.state.selectedType !== '' && (
              <View>
                <Holder paddingVertical marginTop>
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 16, marginRight: 8 }}>All Day?</Text>
                    </View>
                    <Switch value={this.state.allDay} onValueChange={this.onTimeChange} />
                  </View>
                  {this.state.allDay === false && <Text>Time selector here</Text>}
                </Holder>
                {this.state.allDay && (
                  <View>
                    <Holder paddingVertical marginTop transparent>
                      <Button
                        text={this.state.editDay > 0 ? 'Update Availability' : 'Add Availability'}
                        onPress={this.onPressEdit}
                      />
                    </Holder>
                    {this.state.editDay > 0 && (
                      <Holder paddingVertical transparent>
                        <Button
                          text="Remove Availability"
                          onPress={this.onPressDelete}
                          type="secondary"
                        />
                      </Holder>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </Container>
    );
  }
}

Detail.propTypes = {
  selectedDate: PropTypes.number,
  loading: PropTypes.bool,
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setParams: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.object,
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
  createTimeSegment: PropTypes.func.isRequired,
  removeTimeSegment: PropTypes.func.isRequired,
  updateTimeSegment: PropTypes.func.isRequired,
};

const createTimeSegment = graphql(CREATE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    createTimeSegment: ({ scheduleId, status, startTime, endTime }) =>
      mutate({
        variables: { timeSegment: { scheduleId, status, startTime, endTime } },
        refetchQueries: [
          {
            query: CURRENT_USER_QUERY,
          },
        ],
      }),
  }),
});

const removeTimeSegment = graphql(REMOVE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    removeTimeSegment: ({ segmentId }) =>
      mutate({
        variables: { timeSegment: { segmentId } },
        refetchQueries: [
          {
            query: CURRENT_USER_QUERY,
          },
        ],
      }),
  }),
});

const updateTimeSegment = graphql(UPDATE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    updateTimeSegment: ({ segmentId, status, startTime, endTime }) =>
      mutate({
        variables: { timeSegment: { segmentId, status, startTime, endTime } },
        refetchQueries: [
          {
            query: CURRENT_USER_QUERY,
          },
        ],
      }),
  }),
});

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
});

export default compose(
  connect(mapStateToProps),
  createTimeSegment,
  removeTimeSegment,
  updateTimeSegment,
  userQuery,
)(Detail);
