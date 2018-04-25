import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const ButtonIcon = ({ backgroundColor, text, icon, onPress }) => {
  const containerStyles = [styles.buttonIconContainer];

  if (backgroundColor) {
    containerStyles.push({ backgroundColor });
  }

  return (
    <TouchableOpacity onPress={onPress} style={containerStyles}>
      <Icon size={60} name={icon} color="white" />
      <Text style={styles.buttonIconText}>{text}</Text>
    </TouchableOpacity>
  );
};

ButtonIcon.propTypes = {
  backgroundColor: PropTypes.string,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onPress: PropTypes.func,
};

export default ButtonIcon;
