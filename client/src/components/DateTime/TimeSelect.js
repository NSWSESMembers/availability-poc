import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { isSelectorDisabled, selectColor } from '../../selectors/schedules';

import { ButtonBox } from '../Button';

import styles from './styles';

const TimeSelect = ({ selectionSegments, onPress, onPressNewSegment }) => {
  const start = moment()
    .startOf('day')
    .unix();

  return (
    <View style={styles.timeSelectContainer}>
      {selectionSegments.map(segment => (
        <View key={`${segment.startTime}-${segment.endTime}`} style={styles.timeSelectChild}>
          <ButtonBox
            key={`${segment.startTime}-${segment.endTime}`}
            text={segment.label}
            subtext={`${moment.unix(start + segment.startTime).format('HH:mm')} - ${moment
              .unix(start + segment.endTime)
              .format('HH:mm')}`}
            onPress={() => onPress(segment)}
            selected={segment.status !== ''}
            selectedColor={selectColor(segment.status)}
            disabled={isSelectorDisabled(
              selectionSegments,
              segment.status,
              segment.startTime,
              segment.endTime,
            )}
          />
        </View>
      ))}
      <View style={styles.timeSelectChild}>
        <ButtonBox
          text="{{ New Custom }}"
          subtext="Enter New Time"
          onPress={onPressNewSegment}
          selectedColor={selectColor()}
        />
      </View>
    </View>
  );
};

TimeSelect.propTypes = {
  onPress: PropTypes.func.isRequired,
  onPressNewSegment: PropTypes.func.isRequired,
  selectionSegments: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

export default TimeSelect;
