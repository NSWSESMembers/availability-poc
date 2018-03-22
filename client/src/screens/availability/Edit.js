import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';
import {
  CREATE_TIME_SEGMENT_MUTATION,
  REMOVE_TIME_SEGMENT_MUTATION,
  UPDATE_TIME_SEGMENT_MUTATION,
} from '../../graphql/time-segment.mutation';

import { Alert } from '../../components/Alert';
import ButtonRowPicker from '../../components/ButtonRowPicker';
import TextInputRow from '../../components/TextInputRow';
import { Button, ButtonRow } from '../../components/Button';
import { DatePicker } from '../../components/Calendar';
import { Container, Holder } from '../../components/Container';
import { Separator } from '../../components/Separator';

class Edit extends Component {
  static navigationOptions = () => ({
    title: 'Edit Availability',
    tabBarIcon: ({ tintColor }) => <Icon size={24} name="calendar" color={tintColor} />,
    tabBarLabel: 'Availability',
  });

  constructor(props) {
    super(props);

    const dt = moment.unix(props.selectedDate).clone();

    if (props.navigation.state.params && props.navigation.state.params.timeSegment) {
      const { status, startTime, endTime, id } = props.navigation.state.params.timeSegment;

      // initialize other state
      this.state = {
        id,
        startTime: moment.unix(startTime).toDate(),
        endTime: moment.unix(endTime).toDate(),
        availibilityStatus: status,
        availibilityComment: '',
      };
    } else {
      this.state = {
        id: 0,
        startTime: dt.set({ hour: 9, minute: 0 }).toDate(),
        endTime: dt.set({ hour: 17, minute: 0 }).toDate(),
        availibilityStatus: 'Available',
        availibilityComment: '',
      };
    }
  }
  handleSave = () => {
    if (this.state.id === 0) {
      this.props.createTimeSegment({
        scheduleId: this.props.selectedSchedule.id,
        status: this.state.availibilityStatus,
        startTime: moment(this.state.startTime).unix(),
        endTime: moment(this.state.endTime).unix(),
      });
    } else {
      this.props.updateTimeSegment({
        segmentId: this.state.id,
        status: this.state.availibilityStatus,
        startTime: moment(this.state.startTime).unix(),
        endTime: moment(this.state.endTime).unix(),
      });
    }
    this.props.navigation.goBack();
  };

  handleRemove = () => {
    this.props.removeTimeSegment({ segmentId: parseInt(this.state.id, 10) });
    this.props.navigation.goBack();
  };

  handleDatePicked = (startTime) => {
    const hour = moment(this.state.endTime).get('hour');
    const minute = moment(this.state.endTime).get('minute');

    const endTime = moment(startTime);
    endTime.set({
      hour,
      minute,
    });

    this.setState({ startTime });
    this.setState({ endTime: endTime.toDate() });
  };

  handleStartTimePicked = (startTime) => {
    this.setState({ startTime });
  };

  handleEndTimePicked = (endTime) => {
    this.setState({ endTime });
  };

  handleAvailibilityStatusPicked = (availibilityStatus) => {
    this.setState({ availibilityStatus });
  };

  handleAvailibilityComment = (availibilityComment) => {
    this.setState({ availibilityComment });
  };

  handleRequests = () => {
    this.props.navigation.navigate('Requests');
  };

  render() {
    return (
      <Container>
        <Holder>
          <ButtonRow title="Request" showIcon description={this.props.selectedSchedule.name} />
        </Holder>
        <Holder>
          <DatePicker
            title="Selected Date"
            date={this.state.startTime}
            onSelect={this.handleDatePicked}
          />
        </Holder>
        <Separator />
        <Holder>
          <DatePicker
            title="Start Time"
            date={this.state.startTime}
            onSelect={this.handleStartTimePicked}
            mode="time"
          />
        </Holder>
        <Separator />
        <Holder>
          <DatePicker
            title="End Time"
            date={this.state.endTime}
            onSelect={this.handleEndTimePicked}
            mode="time"
          />
        </Holder>
        <Separator />
        <Holder>
          <ButtonRowPicker
            title="Availability"
            selected={this.state.availibilityStatus}
            onSelect={this.handleAvailibilityStatusPicked}
            showIcon
          />
        </Holder>
        <Separator />
        <Holder>
          <TextInputRow
            title="Comments"
            comment={this.state.availibilityComment}
            onSelect={this.handleAvailibilityComment}
          />
        </Holder>
        <Holder margin transparent>
          <Button onPress={this.handleSave} text="Save Availability" />
        </Holder>
        {this.state.id !== 0 && (
          <Holder margin transparent>
            <Button onPress={this.handleRemove} text="Remove Availability" type="secondary" />
          </Holder>
        )}
        <Alert
          ref={(el) => {
            this.popRef = el;
          }}
          status={this.state.status}
          message={this.state.errorMessage}
        />
      </Container>
    );
  }
}

Edit.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setParams: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.object,
    }),
  }),
  selectedDate: PropTypes.number.isRequired,
  selectedSchedule: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
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

const mapStateToProps = state => ({
  selectedRequests: state.availability.selectedRequests,
  selectedDate: state.availability.selectedDate,
  selectedSchedule: state.availability.selectedSchedule,
  availibilityStatus: state.availability.availibilityStatus,
  availibilityComment: state.availability.availibilityComment,
});

export default compose(
  connect(mapStateToProps),
  createTimeSegment,
  removeTimeSegment,
  updateTimeSegment,
)(Edit);
