import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const ListItem = ({
  type = 'list', // box
  text,
  summary,
  onPress,
  selected = false,
}) => {
  const colour = selected ? styles.available : styles.unavailable;

  let rowStyle = styles.row;
  if (type === 'box') {
    rowStyle = styles.eventCard;
    if (selected) {
      rowStyle = [styles.eventCard, styles.eventUrgent];
    }
  }

  return (
    <TouchableHighlight onPress={onPress} underlayColor="#FFFFFF">
      <View style={rowStyle}>
        { type === 'list' ? (
          <View style={[styles.indicator, colour]} />
        ) : null}
        <View>
          <Text style={styles.h3}>{text}{selected}</Text>
          <Text style={styles.summary}>{summary}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

ListItem.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  summary: PropTypes.string,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
};

export default ListItem;
