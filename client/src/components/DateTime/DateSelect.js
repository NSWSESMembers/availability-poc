import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { NOT_SPECIFIED, AVAILABLE, UNAVAILABLE, URGENT, OUT_OF_RANGE } from '../../constants';

import styles from './styles';

const DateSelect = ({ day, select = false, onSelect, availType = NOT_SPECIFIED }) => {
  let dayStyles = [styles.day];
  let dayLabelStyles = [styles.dayLabel];
  let dayIconStyles = [styles.dayIcon];

  if (availType === OUT_OF_RANGE) {
    dayStyles = [styles.dayOutOfRange];
    dayLabelStyles = [styles.dayLabelOutOfRange];
  }

  if (availType === AVAILABLE) {
    dayStyles = [styles.dayAvailable];
    dayLabelStyles = [styles.dayLabelAvailable];
  }

  if (availType === UNAVAILABLE) {
    dayStyles = [styles.dayUnavailable];
    dayLabelStyles = [styles.dayLabelUnavailable];
  }

  if (availType === URGENT) {
    dayStyles = [styles.dayUrgent];
    dayLabelStyles = [styles.dayLabelUrgent];
  }

  if (select) {
    dayStyles = [styles.daySelect];
    dayLabelStyles = [styles.dayLabelSelect];
    dayIconStyles = [styles.dayIconSelect];
  }

  if (availType === OUT_OF_RANGE) {
    return (
      <View style={dayStyles}>
        <Text style={dayLabelStyles}>{moment.unix(day).format('dd')}</Text>
        <Text style={dayLabelStyles}>{moment.unix(day).format('DD')}</Text>
        <Icon size={18} name="check-circle" color="white" />
      </View>
    );
  }

  if (availType === 'NotSpecified') {
    return (
      <TouchableOpacity style={dayStyles} onPress={() => onSelect(day)}>
        <Text style={dayLabelStyles}>{moment.unix(day).format('dd')}</Text>
        <Text style={dayLabelStyles}>{moment.unix(day).format('DD')}</Text>
        <Icon size={18} name="check-circle" color="white" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={dayStyles} onPress={() => onSelect(day)}>
      <Text style={dayLabelStyles}>{moment.unix(day).format('dd')}</Text>
      <Text style={dayLabelStyles}>{moment.unix(day).format('DD')}</Text>
      {availType === AVAILABLE && <Icon size={18} name="check-circle" style={dayIconStyles} />}
      {availType === UNAVAILABLE && <Icon size={18} name="times-circle" style={dayIconStyles} />}
      {availType === URGENT && <Icon size={18} name="exclamation-circle" style={dayIconStyles} />}
    </TouchableOpacity>
  );
};

DateSelect.propTypes = {
  day: PropTypes.number.isRequired,
  select: PropTypes.bool,
  onSelect: PropTypes.func,
  availType: PropTypes.string,
};

export default DateSelect;
