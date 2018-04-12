import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { DateSelect } from './';

import styles from './styles';

const DateRange = ({
  timeSegments,
  startTime,
  endTime,
  selectedDays,
  editDay,
  onSelect,
  onEdit,
}) => {
  const startDay = moment.unix(startTime).startOf('day');
  const endDay = moment.unix(endTime).endOf('day');

  const startOfWeek = startDay.startOf('isoWeek');
  const endOfWeek = endDay.endOf('isoWeek');
  const difference = endOfWeek.diff(startOfWeek, 'days') + 1;

  const table = [];
  let rows = [];
  for (let i = 0; i < difference; i += 1) {
    const day = startOfWeek.add(i === 0 ? 0 : 1, 'days').unix();
    const dayUnix = 24 * 60 * 60;
    let endOfDay = parseInt(day, 0) + dayUnix;
    endOfDay -= 1;

    let availType = 'NotSpecified';
    if (day < startTime || day > endTime) {
      availType = 'OutOfRange';
    } else {
      const results = timeSegments.filter(
        timeSegment => timeSegment.startTime >= day && timeSegment.endTime <= endOfDay,
      );

      if (results.length > 0) {
        availType = results[0].status;
      }
    }

    rows.push(
      <DateSelect
        key={`${i}column`}
        availType={availType}
        date={day}
        onSelect={onSelect}
        onEdit={onEdit}
        select={selectedDays.indexOf(day) !== -1}
        edit={day === editDay}
        fade={editDay > 0 && day !== editDay}
      />,
    );

    if ((i + 1) % 7 === 0) {
      table.push(
        <View key={`${i}row`} style={styles.week}>
          {rows}
        </View>,
      );
      rows = [];
    }
  }
  return <View style={{ flexDirection: 'column' }}>{table}</View>;
};

DateRange.propTypes = {
  timeSegments: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ),
  selectedDays: PropTypes.arrayOf(PropTypes.number),
  editDay: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default DateRange;
