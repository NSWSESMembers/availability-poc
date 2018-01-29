import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const ButtonRow = ({ title, description, onPress }) => (
  <TouchableOpacity onPress={() => onPress()}>
    <View style={styles.buttonRow}>
      <View>
        <Text style={styles.buttonRowTitle}>{title.toUpperCase()}</Text>
        <Text style={styles.buttonRowDescription}>{description}</Text>
      </View>
      <Icon name="angle-right" size={40} color="#EEE" />
    </View>
  </TouchableOpacity>
);

ButtonRow.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default ButtonRow;
