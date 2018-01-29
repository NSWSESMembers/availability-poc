import React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';

import { WeekDay } from './';
import styles from './styles';

const Week = ({ selectedDate, onChangeDate }) => {
  let begin = selectedDate.clone().isoWeekday(1);

  const weekDays = [];
  for (let i = 0; i < 7; i += 1) {
    const weekday = {
      date: begin,
      selected: false,
      hasDetail: false,
    };

    if (weekday.date.format('MM/DD/YYYY') === selectedDate.format('MM/DD/YYYY')) {
      weekday.selected = true;
    }

    weekDays.push(weekday);
    begin = moment(begin).add(1, 'days');
  }

  const weekDaysList = weekDays.map(weekDay => (
    <WeekDay
      key={weekDay.date}
      date={weekDay.date}
      selected={weekDay.selected}
      hasDetail={weekDay.hasDetail}
      onChangeDate={onChangeDate}
    />
  ));

  return <View style={styles.week}>{weekDaysList}</View>;
};

Week.propTypes = {
  onChangeDate: PropTypes.func,
  selectedDate: PropTypes.instanceOf(moment).isRequired,
};

export default Week;
