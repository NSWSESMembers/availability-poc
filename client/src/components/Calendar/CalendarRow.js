import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import Colors from '../../themes/Colors';

import { Timeline } from './';

const CalendarRow = ({ item, onPressItem }) => {
  const buttonStyles = [styles.rowDetailItem];

  // these need to be moved to numbers eventually
  if (item.status === 'Unavailable') {
    buttonStyles.push({ backgroundColor: Colors.bgBtnUnavailable });
  }

  if (item.status === 'Unavailable - unless urgent') {
    buttonStyles.push({ backgroundColor: Colors.bgBtnUrgent });
  }

  return (
    <View style={styles.row}>
      <Timeline startDateTime={item.startTime} endDateTime={item.endTime} />
      <View style={styles.rowDetail}>
        <TouchableOpacity onPress={() => onPressItem()} key={item.id}>
          <View style={buttonStyles}>
            <Text style={styles.rowDetailItemText}>{item.requestName}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

CalendarRow.propTypes = {
  item: PropTypes.shape({
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }),
  onPressItem: PropTypes.func,
};

export default CalendarRow;
