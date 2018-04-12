import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { ButtonBox } from '../Button';

import styles from './styles';

const TimeSelect = ({ day, timeSegments, selectionSegments }) => {
  const dayStyles = [styles.day];
  const dayLabelStyles = [styles.dayLabel];
  const dayIconStyles = [styles.dayIcon];

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {selectionSegments.map(segment => (
          <ButtonBox
            key={`${segment.startTime}-${segment.endTime}`}
            text={segment.label}
            subtext={`${moment.unix(segment.startTime).format('HH:mm a')} - ${moment
              .unix(segment.endTime)
              .format('HH:mm a')}`}
            onPress={() => console.log('clicked')}
            selected={false}
            selectedColor="green"
          />
        ))}
      </View>
    </View>
  );
};

TimeSelect.propTypes = {
  selectionSegments: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  timeSegments: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ),
};

export default TimeSelect;
