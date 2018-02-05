import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';
import CREATE_TIME_SEGMENT_MUTATION from '../../graphql/create-time-segment.mutation';
import REMOVE_TIME_SEGMENT_MUTATION from '../../graphql/remove-time-segment.mutation';
import UPDATE_TIME_SEGMENT_MUTATION from '../../graphql/update-time-segment.mutation';

import ButtonRowPicker from '../../components/ButtonRowPicker';
import TextInputRow from '../../components/TextInputRow';
import { Button, ButtonRow } from '../../components/Button';
import { DatePicker } from '../../components/Calendar';
import { Container, Holder } from '../../components/Container';
import { Separator } from '../../components/Separator';

import { setSelectedRequests } from '../../state/availability.actions';

class Edit extends Component {
  static navigationOptions = () => ({
    title: 'Availability',
    tabBarIcon: ({ tintColor }) => <Icon size={24} name="calendar" color={tintColor} />,
  });

  constructor(props) {
    super(props);

    const dt = moment.unix(props.selectedDate).clone();

    if (props.navigation.state.params && props.navigation.state.params.timeSegment) {
      const {
        requestId,
        requestName,
        startTime,
        endTime,
        id,
      } = props.navigation.state.params.timeSegment;

      // set selectedRequests
      this.props.dispatch(
        setSelectedRequests([{ label: requestName, value: requestId.toString() }]),
      );

      // initialize other state
      this.state = {
        id,
        startTime: moment.unix(startTime).toDate(),
        endTime: moment.unix(endTime).toDate(),
        availibilityStatus: 'Available',
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
  // scheduleId, status, startTime, endTime
  // TODO - add error handling
  handleSave = () => {
    if (this.state.id === 0) {
      _.forEach(this.props.selectedRequests, (request) => {
        this.props.createTimeSegment({
          scheduleId: parseInt(request.value, 10),
          status: this.state.availibilityStatus,
          startTime: moment(this.state.startTime).unix(),
          endTime: moment(this.state.endTime).unix(),
        });
      });
    } else {
      this.props.updateTimeSegment({
        segmentId: this.state.id,
        status: this.state.availibilityStatus,
        startTime: moment(this.state.startTime).unix(),
        endTime: moment(this.state.endTime).unix(),
      });
    }
    this.props.dispatch(setSelectedRequests([]));
    this.props.navigation.goBack();
  };

  handleRemove = () => {
    this.props.removeTimeSegment({ segmentId: parseInt(this.state.id, 10) });
    this.props.dispatch(setSelectedRequests([]));
    this.props.navigation.goBack();
  };

  handleDatePicked = (startTime) => {
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
    const requestDetail =
      this.props.selectedRequests.length > 0
        ? this.props.selectedRequests.map(elem => elem.label).join(', ')
        : '-- none selected --';

    return (
      <Container>
        <Holder>
          {this.state.id !== 0 ? (
            <ButtonRow title="Request" showIcon description={requestDetail} />
          ) : (
            <ButtonRow
              title="Requests"
              showIcon
              description={requestDetail}
              onPress={this.handleRequests}
            />
          )}
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
            onSelect={this.handleDatePicked}
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
  selectedRequests: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  dispatch: PropTypes.func.isRequired,
  selectedDate: PropTypes.number.isRequired,
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
  availibilityStatus: state.availability.availibilityStatus,
  availibilityComment: state.availability.availibilityComment,
});

export default compose(
  connect(mapStateToProps),
  createTimeSegment,
  removeTimeSegment,
  updateTimeSegment,
)(Edit);
