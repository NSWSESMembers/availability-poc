import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const ButtonRowNoPress = ({ title, description, showIcon }) => (
  <View style={styles.buttonRow}>
    <View>
      <Text style={styles.buttonRowTitle}>{title.toUpperCase()}</Text>
      {description && <Text style={styles.buttonRowDescription}>{description}</Text>}
    </View>
    {showIcon && <Icon name="angle-right" size={40} color="#EEE" />}
  </View>
);

ButtonRowNoPress.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  showIcon: PropTypes.bool,
};

export default ButtonRowNoPress;
