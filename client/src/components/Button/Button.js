import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';
import styles from './styles';

const Button = ({ text, onPress, type, disabled }) => {
  let style = [styles.buttonStyle];
  let textStyle = [styles.textStyle];

  if (type === 'secondary') {
    style = [styles.buttonStyleSecondary];
    textStyle = [styles.textStyleSecondary];
  }

  return (
    <TouchableOpacity style={style} onPress={onPress} disabled={disabled}>
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  type: 'primary',
  disabled: false,
};

export default Button;
