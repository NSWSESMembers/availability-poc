import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import { Timeline } from './';

const CalendarRow = ({ item, onPressItem }) => (
  <View style={styles.row}>
    <Timeline startDateTime={item.startTime} endDateTime={item.endTime} />
    <View style={styles.rowDetail}>
      <TouchableOpacity onPress={() => onPressItem()} key={item.id}>
        <View style={styles.rowDetailItem}>
          <Text style={styles.rowDetailItemText}>{item.requestName}</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

CalendarRow.propTypes = {
  item: PropTypes.shape({
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
  }),
  onPressItem: PropTypes.func,
};

export default CalendarRow;
