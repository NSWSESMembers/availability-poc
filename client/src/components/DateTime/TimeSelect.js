import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { isSelectorDisabled, selectColor } from '../../selectors/schedules';

import { ButtonBox } from '../Button';

const TimeSelect = ({ selectionSegments, onPress }) => {
  const start = moment()
    .startOf('day')
    .unix();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
      {selectionSegments.map(segment => (
        <View key={`${segment.startTime}-${segment.endTime}`} style={{ marginBottom: 5 }}>
          <ButtonBox
            text={segment.label}
            subtext={`${moment.unix(start + segment.startTime).format('HH:mm a')} - ${moment
              .unix(start + segment.endTime)
              .format('HH:mm a')}`}
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
    </View>
  );
};

TimeSelect.propTypes = {
  onPress: PropTypes.func.isRequired,
  selectionSegments: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

export default TimeSelect;
