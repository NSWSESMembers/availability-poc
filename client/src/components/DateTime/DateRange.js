import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { DateSelect } from './';

import styles from './styles';

const DateRange = ({ timeSegments, startTime, endTime }) => {
  const startDay = moment.unix(startTime).startOf('day');
  const endDay = moment.unix(endTime).endOf('day');

  const startOfWeek = startDay.startOf('isoWeek');
  const endOfWeek = endDay.endOf('isoWeek');
  const difference = endOfWeek.diff(startOfWeek, 'days') + 1;

  /*
  const table = [];
  const rows = [];
  for (let i = 0; i < difference; i += 7) {
    rows.push(
      <DateSelect
        style={styles.day}
        key={i + 0}
        date={startOfWeek.add(i === 0 ? 0 : 1, 'days').unix()}
      />,
    );
    rows.push(
      <DateSelect style={styles.day} key={i + 1} date={startOfWeek.add(1, 'days').unix()} />,
    );
    rows.push(
      <DateSelect style={styles.day} key={i + 2} date={startOfWeek.add(1, 'days').unix()} />,
    );
    rows.push(
      <DateSelect style={styles.day} key={i + 3} date={startOfWeek.add(1, 'days').unix()} />,
    );
    rows.push(
      <DateSelect style={styles.day} key={i + 4} date={startOfWeek.add(1, 'days').unix()} />,
    );
    rows.push(
      <DateSelect style={styles.day} key={i + 5} date={startOfWeek.add(1, 'days').unix()} />,
    );
    rows.push(
      <DateSelect style={styles.day} key={i + 6} date={startOfWeek.add(1, 'days').unix()} />,
    );
    table.push(
      <View key={`${i}row`} style={styles.week}>
        {rows}
      </View>,
    );
  }
  */

  return (
    <View style={{ flexDirection: 'column' }}>
      <View style={styles.week}>
        <DateSelect availType="OutOfRange" date={startOfWeek.add(0, 'days').unix()} />
        <DateSelect availType="OutOfRange" date={startOfWeek.add(1, 'days').unix()} />
        <DateSelect availType="OutOfRange" date={startOfWeek.add(1, 'days').unix()} />
        <DateSelect availType="OutOfRange" date={startOfWeek.add(1, 'days').unix()} />
        <DateSelect availType="Available" date={startOfWeek.add(1, 'days').unix()} />
        <DateSelect availType="Unavailable" date={startOfWeek.add(1, 'days').unix()} />
        <DateSelect availType="Urgent" date={startOfWeek.add(1, 'days').unix()} />
      </View>
      <View style={styles.week}>
        <DateSelect date={startOfWeek.add(1, 'days').unix()} />
        <DateSelect date={startOfWeek.add(1, 'days').unix()} />
        <DateSelect date={startOfWeek.add(1, 'days').unix()} />
        <DateSelect date={startOfWeek.add(1, 'days').unix()} />
        <DateSelect date={startOfWeek.add(1, 'days').unix()} />
        <DateSelect availType="OutOfRange" date={startOfWeek.add(1, 'days').unix()} />
        <DateSelect availType="OutOfRange" date={startOfWeek.add(1, 'days').unix()} />
      </View>
    </View>
  );
};

DateRange.propTypes = {
  timeSegments: PropTypes.shape({
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }),
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
};

export default DateRange;
