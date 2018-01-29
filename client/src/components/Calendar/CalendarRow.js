import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import { Timeline } from './';

const CalendarRow = ({ item, onPressItem }) => (
  <View style={styles.row}>
    <Timeline startDateTime={item.startDateTime} endDateTime={item.endDateTime} />
    <View style={styles.rowDetail}>
      {item.requests.map(request => (
        <TouchableOpacity onPress={() => onPressItem()} key={request.value}>
          <View style={styles.rowDetailItem}>
            <Text style={styles.rowDetailItemText}>{request.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

CalendarRow.propTypes = {
  item: PropTypes.shape({
    startDateTime: PropTypes.number.isRequired,
    endDateTime: PropTypes.number.isRequired,
  }),
  onPressItem: PropTypes.func,
};

export default CalendarRow;
