import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    };
  }

  handleSave = () => {
    const item = {
      startDateTime: moment(this.state.startDate).unix(),
      endDateTime: moment(this.state.endDate).unix(),
      requests: this.props.selectedRequests,
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
          <ButtonRow title="Requests" description={requestDetail} onPress={this.handleRequests} />
        </Holder>
        <Holder>
          <DatePicker date={this.state.startDate} onSelect={this.handleDatePicked} />
        </Holder>
        <Separator />
        <Holder>
          <DatePicker date={this.state.startDate} onSelect={this.handleDatePicked} mode="time" />
        </Holder>
        <Separator />
        <Holder>
          <DatePicker date={this.state.endDate} onSelect={this.handleEndTimePicked} mode="time" />
        </Holder>
        <Holder margin transparent>
          <Button onPress={this.handleSave} text="Submit Availability" />
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
});

export default connect(mapStateToProps)(Edit);
