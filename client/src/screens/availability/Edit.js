import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ButtonRowPicker from '../../components/ButtonRowPicker';
import TextInputRow from '../../components/TextInputRow';
import { Button, ButtonRow } from '../../components/Button';
import { DatePicker } from '../../components/Calendar';
import { Container, Holder } from '../../components/Container';
import { Separator } from '../../components/Separator';
import { addAvailability } from '../../state/availability.actions';

class Edit extends Component {
  static navigationOptions = () => ({
    title: 'Availability',
    tabBarIcon: ({ tintColor }) => <Icon size={24} name="calendar" color={tintColor} />,
  });

  constructor(props) {
    super(props);

    const dt = moment.unix(props.selectedDate).clone();
    this.state = {
      startDate: dt.set({ hour: 9, minute: 0 }).toDate(),
      endDate: dt.set({ hour: 17, minute: 0 }).toDate(),
      availibilityStatus: 'Available',
      availibilityComment: '',
    };
  }

  handleSave = () => {
    const item = {
      startDateTime: moment(this.state.startDate).unix(),
      endDateTime: moment(this.state.endDate).unix(),
      requests: this.props.selectedRequests,
      availibilityStatus: this.state.availibilityStatus,
      availibilityComment: this.state.availibilityComment,

    };

    if (item.requests.length > 0) {
      this.props.dispatch(addAvailability(item));
      this.props.navigation.goBack();
    } else {
      // todo alert.
    }
  };

  handleDatePicked = (startDate) => {
    this.setState({ startDate });
  };

  handleEndTimePicked = (endDate) => {
    this.setState({ endDate });
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
          <ButtonRow title="Requests" showIcon description={requestDetail} onPress={this.handleRequests} />
        </Holder>
        <Holder>
          <DatePicker title="Selected Date" date={this.state.startDate} onSelect={this.handleDatePicked} />
        </Holder>
        <Separator />
        <Holder>
          <DatePicker title="Start Time" date={this.state.startDate} onSelect={this.handleDatePicked} mode="time" />
        </Holder>
        <Separator />
        <Holder>
          <DatePicker title="End Time" date={this.state.endDate} onSelect={this.handleEndTimePicked} mode="time" />
        </Holder>
        <Separator />
        <Holder>
          <ButtonRowPicker title="Availability" selected={this.state.availibilityStatus} onSelect={this.handleAvailibilityStatusPicked} />
        </Holder>
        <Separator />
        <Holder>
          <TextInputRow title="Comments" comment={this.state.availibilityComment} onSelect={this.handleAvailibilityComment} />
        </Holder>
        <Holder margin transparent>
          <Button onPress={this.handleSave} text="Save Availability" />
        </Holder>
      </Container>
    );
  }
}

Edit.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setParams: PropTypes.func,
  }),
  selectedRequests: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  dispatch: PropTypes.func.isRequired,
  selectedDate: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  selectedRequests: state.availability.selectedRequests,
  selectedDate: state.availability.selectedDate,
  availibilityStatus: state.availability.availibilityStatus,
  availibilityComment: state.availability.availibilityComment,
});

export default connect(mapStateToProps)(Edit);
