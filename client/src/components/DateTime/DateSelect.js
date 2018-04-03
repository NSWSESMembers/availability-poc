import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const DateSelect = ({
  date,
  select = false,
  onSelect,
  availType = 'NotSpecified',
  availLength = 'Full',
}) => {
  let dayStyles = [styles.day];
  let dayLabelStyles = [styles.dayLabel];

  if (availType === 'OutOfRange') {
    dayStyles = styles.dayOutOfRange;
    dayLabelStyles = styles.dayLabelOutOfRange;
  }

  if (availType === 'Available') {
    dayStyles = styles.dayAvailable;
    dayLabelStyles = styles.dayLabelAvailable;
  }

  if (availType === 'Unavailable') {
    dayStyles = styles.dayUnavailable;
    dayLabelStyles = styles.dayLabelUnavailable;
  }

  if (availType === 'Unavailable - unless urgent') {
    dayStyles = styles.dayUrgent;
    dayLabelStyles = styles.dayLabelUrgent;
  }

  if (select && availType === 'NotSpecified') {
    dayStyles = styles.daySelect;
    dayLabelStyles = styles.dayLabelSelect;
  }

  if (availType === 'OutOfRange') {
    return (
      <View style={dayStyles}>
        <Text style={dayLabelStyles}>{moment.unix(date).format('DD')}</Text>
        {availType === 'OutOfRange' && <Icon size={18} name="check-circle" color="white" />}
        {availType === 'Available' && <Icon size={18} name="check-circle" />}
        {availType === 'Unavailable' && <Icon size={18} name="times-circle" />}
        {availType === 'Unavailable - unless urgent' && (
          <Icon size={18} name="exclamation-circle" />
        )}
        {availType === 'NotSpecified' && <Icon size={18} name="check-circle" color="white" />}
      </View>
    );
  }
  return (
    <TouchableOpacity style={dayStyles} onPress={() => onSelect(date)}>
      <Text style={dayLabelStyles}>{moment.unix(date).format('DD')}</Text>
      {availType === 'OutOfRange' && <Icon size={18} name="check-circle" color="white" />}
      {availType === 'Available' && <Icon size={18} name="check-circle" />}
      {availType === 'Unavailable' && <Icon size={18} name="times-circle" />}
      {availType === 'Unavailable - unless urgent' && <Icon size={18} name="exclamation-circle" />}
      {availType === 'NotSpecified' && <Icon size={18} name="check-circle" color="white" />}
    </TouchableOpacity>
  );
};

DateSelect.propTypes = {
  date: PropTypes.number.isRequired,
  select: PropTypes.bool,
  onSelect: PropTypes.func,
  availType: PropTypes.string,
  availLength: PropTypes.string,
};

export default DateSelect;
