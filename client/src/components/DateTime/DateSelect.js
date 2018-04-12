import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const DateSelect = ({
  date,
  select = false,
  edit = false,
  fade = false,
  onSelect,
  onEdit,
  availType = 'NotSpecified',
}) => {
  let dayStyles = [styles.day];
  let dayLabelStyles = [styles.dayLabel];
  const dayIconStyles = [styles.dayIcon];

  if (availType === 'OutOfRange') {
    dayStyles = [styles.dayOutOfRange];
    dayLabelStyles = [styles.dayLabelOutOfRange];
  }

  if (availType === 'Available') {
    dayStyles = [styles.dayAvailable];
    dayLabelStyles = [styles.dayLabelAvailable];
  }

  if (availType === 'Unavailable') {
    dayStyles = [styles.dayUnavailable];
    dayLabelStyles = [styles.dayLabelUnavailable];
  }

  if (availType === 'Urgent') {
    dayStyles = [styles.dayUrgent];
    dayLabelStyles = [styles.dayLabelUrgent];
  }

  if (select && availType === 'NotSpecified') {
    dayStyles = [styles.daySelect];
    dayLabelStyles = [styles.dayLabelSelect];
  }
  /*
  if (edit) {
    dayStyles = [styles.dayEdit];
    dayLabelStyles = [styles.dayLabelEdit];
  }
*/
  if (fade) {
    dayStyles.push({ backgroundColor: 'transparent', borderColor: '#AAA' });
    dayLabelStyles.push({ color: '#AAA' });
    dayIconStyles.push({ color: '#AAA' });
  }

  if (availType === 'OutOfRange') {
    return (
      <View style={dayStyles}>
        <Text style={dayLabelStyles}>{moment.unix(date).format('dd')}</Text>
        <Text style={dayLabelStyles}>{moment.unix(date).format('DD')}</Text>
        <Icon size={18} name="check-circle" color="white" />
      </View>
    );
  }

  if (availType === 'NotSpecified') {
    return (
      <TouchableOpacity style={dayStyles} onPress={() => onSelect(date)}>
        <Text style={dayLabelStyles}>{moment.unix(date).format('dd')}</Text>
        <Text style={dayLabelStyles}>{moment.unix(date).format('DD')}</Text>
        <Icon size={18} name="check-circle" color="white" />
      </TouchableOpacity>
    );
  }

  if (edit) {
    return (
      <TouchableOpacity style={dayStyles} onPress={() => onEdit(date)}>
        <Text style={dayLabelStyles}>{moment.unix(date).format('dd')}</Text>
        <Text style={dayLabelStyles}>{moment.unix(date).format('DD')}</Text>
        {availType === 'Available' && <Icon size={18} name="check-circle" color="white" />}
        {availType === 'Unavailable' && <Icon size={18} name="times-circle" color="white" />}
        {availType === 'Urgent' && <Icon size={18} name="exclamation-circle" color="white" />}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={dayStyles} onPress={() => onEdit(date)}>
      <Text style={dayLabelStyles}>{moment.unix(date).format('dd')}</Text>
      <Text style={dayLabelStyles}>{moment.unix(date).format('DD')}</Text>
      {availType === 'Available' && <Icon size={18} name="check-circle" style={dayIconStyles} />}
      {availType === 'Unavailable' && <Icon size={18} name="times-circle" style={dayIconStyles} />}
      {availType === 'Urgent' && <Icon size={18} name="exclamation-circle" style={dayIconStyles} />}
    </TouchableOpacity>
  );
};

DateSelect.propTypes = {
  date: PropTypes.number.isRequired,
  select: PropTypes.bool,
  edit: PropTypes.bool,
  fade: PropTypes.bool,
  onSelect: PropTypes.func,
  onEdit: PropTypes.func,
  availType: PropTypes.string,
};

export default DateSelect;
