import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';
import styles from './styles';

const ButtonBox = ({ text, onPress, selected, selectedColor }) => {
  const buttonStyleBox = [styles.buttonStyleBox];
  const textStyleBox = [styles.textStyleBox];

  if (selected) {
    buttonStyleBox.push({ borderColor: selectedColor, backgroundColor: selectedColor });
    textStyleBox.push({ color: 'white' });
  }
  return (
    <TouchableOpacity style={buttonStyleBox} onPress={() => onPress()}>
      <Text style={textStyleBox}>{text}</Text>
    </TouchableOpacity>
  );
};

ButtonBox.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  selectedColor: PropTypes.string,
};

export default ButtonBox;
