import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import styles from './styles';

const Timeline = ({ startDateTime, endDateTime }) => (
  <View>
    <View style={styles.timelineRow}>
      <View style={styles.content}>
        <Text style={styles.contentText}>{moment.unix(startDateTime).format('h:mm a')}</Text>
      </View>
      <View style={styles.timeline}>
        <View style={styles.line}>
          <View style={[styles.topLine, styles.hiddenLine]} />
          <View style={styles.bottomLine} />
        </View>
        <View style={styles.dot} />
      </View>
    </View>
    <View style={styles.timelineRow}>
      <View style={styles.content}>
        <Text style={styles.contentText}>{moment.unix(endDateTime).format('h:mm a')}</Text>
      </View>
      <View style={styles.timeline}>
        <View style={styles.line}>
          <View style={[styles.topLine]} />
          <View style={[styles.bottomLine, styles.hiddenLine]} />
        </View>
        <View style={styles.dot} />
      </View>
    </View>
  </View>
);

//
Timeline.propTypes = {
  startDateTime: PropTypes.number.isRequired,
  endDateTime: PropTypes.number.isRequired,
};

export default Timeline;
