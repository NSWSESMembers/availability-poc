import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, View } from 'react-native';
import styles from './styles';

const ButtonBox = ({ text, subtext, onPress, selected, selectedColor, disabled }) => {
  const buttonStyleBox = [styles.buttonStyleBox];
  const textStyleBox = [styles.textStyleBox];
  const subtextStyleBox = [styles.subtextStyleBox];

  if (selected) {
    buttonStyleBox.push({ borderColor: selectedColor, backgroundColor: selectedColor });
    textStyleBox.push({ color: 'white' });
    subtextStyleBox.push({ color: 'white' });
  }

  if (disabled) {
    buttonStyleBox.push({ borderColor: '#AAA', backgroundColor: 'white' });
    textStyleBox.push({ color: '#AAA' });
    subtextStyleBox.push({ color: '#AAA' });

    return (
      <View style={buttonStyleBox}>
        <Text style={textStyleBox}>{text}</Text>
        {subtext && <Text style={subtextStyleBox}>{subtext}</Text>}
      </View>
    );
  }

  return (
    <TouchableOpacity style={buttonStyleBox} onPress={() => onPress()}>
      <Text style={textStyleBox}>{text}</Text>
      {subtext && <Text style={subtextStyleBox}>{subtext}</Text>}
    </TouchableOpacity>
  );
};

ButtonBox.propTypes = {
  text: PropTypes.string.isRequired,
  subtext: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  selectedColor: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ButtonBox;
