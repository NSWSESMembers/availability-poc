import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import styles from './styles';

const WeekDay = ({ date, selected, hasDetail, onChangeDate }) => {
  let dayButtonStyle = [styles.dayButton];
  let dayTextStyle = [styles.dayText];
  let dayDetailStyle = [styles.dayHasDetail];

  if (selected) {
    dayButtonStyle = [styles.dayButtonSelected];
    dayTextStyle = [styles.dayTextSelected];
    dayDetailStyle = [styles.dayHasDetailSelected];
  }
  const dt = moment(date);
  return (
    <View style={styles.day}>
      <Text style={styles.dayLabel}>{dt.format('ddd')}</Text>
      <TouchableOpacity style={dayButtonStyle} onPress={() => onChangeDate(dt)}>
        <Text style={dayTextStyle}>{dt.format('D')}</Text>
        {hasDetail && <Text style={dayDetailStyle}>_</Text>}
      </TouchableOpacity>
    </View>
  );
};

WeekDay.propTypes = {
  date: PropTypes.instanceOf(moment),
  selected: PropTypes.bool,
  hasDetail: PropTypes.bool,
  onChangeDate: PropTypes.func,
};

export default WeekDay;
