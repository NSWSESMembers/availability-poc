import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../themes/Colors';

import styles from './styles';

const ButtonBox = ({ text, subtext, onPress, selected, selectedColor, disabled }) => {
  const buttonStyleBox = [styles.buttonStyleBox];
  const textStyleBox = [styles.textStyleBox];
  const subtextStyleBox = [styles.subtextStyleBox];
  const iconStyleBox = [styles.iconStyleBox];

  if (selected) {
    buttonStyleBox.push({ borderColor: selectedColor, backgroundColor: selectedColor });
    textStyleBox.push({ color: 'white' });
    subtextStyleBox.push({ color: 'white' });
    iconStyleBox.push({ color: 'white' });
  }

  if (disabled) {
    buttonStyleBox.push({ borderColor: '#AAA', backgroundColor: 'white' });
    textStyleBox.push({ color: '#AAA' });
    subtextStyleBox.push({ color: '#AAA' });
    iconStyleBox.push({ color: 'white' });

    return (
      <View style={buttonStyleBox}>
        <Text style={textStyleBox}>{text}</Text>
        {subtext && <Text style={subtextStyleBox}>{subtext}</Text>}
        <Icon size={18} name="check-circle" style={iconStyleBox} />
      </View>
    );
  }

  return (
    <TouchableOpacity style={buttonStyleBox} onPress={onPress}>
      <Text style={textStyleBox}>{text}</Text>
      {subtext && <Text style={subtextStyleBox}>{subtext}</Text>}
      {selected !== true && <Icon size={18} name="times-circle" color="white" />}
      {selectedColor === Colors.bgBtnAvailable && (
        <Icon size={18} name="check-circle" style={iconStyleBox} />
      )}
      {selectedColor === Colors.bgBtnUnavailable && (
        <Icon size={18} name="times-circle" style={iconStyleBox} />
      )}
      {selectedColor === Colors.bgBtnUrgent && (
        <Icon size={18} name="exclamation-circle" style={iconStyleBox} />
      )}
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
