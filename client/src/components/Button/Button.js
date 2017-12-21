import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import styles from './styles';

const Button = ({ title, type, disabled, onPress }) => {
  const txtType = `${type}Txt`;

  return (
    <View>
      <TouchableOpacity
        style={disabled === true ? styles.disabled : styles.normal}
        onPress={onPress}
        disabled={disabled}
      >
        {type === 'submit' && (
          <Icon style={[styles.defaultTxt, styles[txtType] || {}]} name="arrow-right" size={20} />
        )}
        <Text style={styles.defaultText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

Button.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
};

export default Button;
