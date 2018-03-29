import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const DateSelect = ({ date, availType = 'NotSpecified', availLength = 'Full' }) => {
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

  if (availType === 'Urgent') {
    dayStyles = styles.dayUrgent;
    dayLabelStyles = styles.dayLabelUrgent;
  }

  return (
    <View style={dayStyles}>
      <Text style={dayLabelStyles}>{moment.unix(date).format('DD')}</Text>
      {availType === 'OutOfRange' && <Icon size={18} name="check-circle" color="white" />}
      {availType === 'Available' && <Icon size={18} name="check-circle" />}
      {availType === 'Unavailable' && <Icon size={18} name="times-circle" />}
      {availType === 'Urgent' && <Icon size={18} name="exclamation-circle" />}
      {availType === 'NotSpecified' && <Icon size={18} name="check-circle" color="white" />}
    </View>
  );
};

DateSelect.propTypes = {
  date: PropTypes.number.isRequired,
  availType: PropTypes.string,
  availLength: PropTypes.string,
};

export default DateSelect;
