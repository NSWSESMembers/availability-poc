import React from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'react-native';

const TimePicker = ({ selectedValue, onValueChange }) => (
  <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
    <Picker.Item label="12:00 AM" value={0} />
    <Picker.Item label="1:00 AM" value={3600} />
    <Picker.Item label="2:00 AM" value={7200} />
    <Picker.Item label="3:00 AM" value={10800} />
    <Picker.Item label="4:00 AM" value={14400} />
    <Picker.Item label="5:00 AM" value={18000} />
    <Picker.Item label="6:00 AM" value={21600} />
    <Picker.Item label="7:00 AM" value={25200} />
    <Picker.Item label="8:00 AM" value={28800} />
    <Picker.Item label="9:00 AM" value={32400} />
    <Picker.Item label="10:00 AM" value={36000} />
    <Picker.Item label="11:00 AM" value={39600} />
    <Picker.Item label="12:00 PM" value={43200} />
    <Picker.Item label="1:00 PM" value={46800} />
    <Picker.Item label="2:00 PM" value={50400} />
    <Picker.Item label="3:00 PM" value={54000} />
    <Picker.Item label="4:00 PM" value={57600} />
    <Picker.Item label="5:00 PM" value={61200} />
    <Picker.Item label="6:00 PM" value={64800} />
    <Picker.Item label="7:00 PM" value={68400} />
    <Picker.Item label="8:00 PM" value={72000} />
    <Picker.Item label="9:00 PM" value={75600} />
    <Picker.Item label="10:00 PM" value={79200} />
    <Picker.Item label="11:00 PM" value={82800} />
    <Picker.Item label="12:00 AM (end of day)" value={86400} />
  </Picker>
);

TimePicker.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  selectedValue: PropTypes.number.isRequired,
};

export default TimePicker;
