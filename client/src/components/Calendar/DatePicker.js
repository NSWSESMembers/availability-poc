import React, { Component } from 'react';
import moment from 'moment';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { ButtonRow } from '../Button';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
    };
  }

  onConfirm = (date) => {
    this.props.onSelect(date);
    this.hideDatePicker();
  };
  hideDatePicker = () => this.setState({ isDatePickerVisible: false });
  showDatePicker = () => this.setState({ isDatePickerVisible: true });

  render() {
    return (
      <View>
        <ButtonRow
          title={this.props.title}
          description={
            this.props.mode === 'date'
              ? moment(this.props.date).format('dddd, DD MMM YYYY')
              : moment(this.props.date).format('h:mm a')
          }
          showIcon
          onPress={this.showDatePicker}
        />
        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this.onConfirm}
          onCancel={this.hideDatePicker}
          mode={this.props.mode}
          date={this.props.date}
        />
      </View>
    );
  }
}

DatePicker.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  mode: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  title: PropTypes.string,
};

DatePicker.defaultProps = {
  mode: 'date',
};

export default DatePicker;
