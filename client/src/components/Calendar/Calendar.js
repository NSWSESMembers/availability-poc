import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import { CalendarRow } from './';
import { Separator } from '../Separator';

import styles from './styles';

let currentDay;
const Calendar = ({ items, onPressItem }) => {
  currentDay = undefined;
  return (
    <ScrollView style={styles.calendar}>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text>No availability recorded for this week</Text>
        </View>
      ) : (
        items.map(item => (
          <View key={item.id}>
            <DayHeader item={item} />
            <CalendarRow item={item} onPressItem={() => onPressItem(item)} />
          </View>
        ))
      )}
    </ScrollView>
  );
};

const DayHeader = ({ item }) => {
  let header = (
    <View style={styles.rowHeader}>
      <Text style={styles.rowHeaderText}>
        {moment
          .unix(item.startTime)
          .format('dddd, DD MMMM')
          .toUpperCase()}
      </Text>
    </View>
  );
  if (currentDay === undefined) {
    currentDay = item.startTime;
  } else if (
    moment.unix(item.startTime).format('YYYY-MM-DD') ===
    moment.unix(currentDay).format('YYYY-MM-DD')
  ) {
    header = <Separator />;
  } else {
    currentDay = item.startTime;
  }

  return <View>{header}</View>;
};

Calendar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
    }),
  ),
  onPressItem: PropTypes.func,
};

DayHeader.propTypes = {
  item: PropTypes.shape({
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
  }),
};

export default Calendar;
