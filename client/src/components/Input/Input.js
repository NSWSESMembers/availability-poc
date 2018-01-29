import React from 'react';
import { View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const Input = (props) => {
  const { value, placeholder, type, onChangeText } = props;

  const propsForType = {
    username: {
      autoCapitalize: 'none',
      autoCorrect: false,
      returnKeyType: 'next',
    },
    email: {
      autoCapitalize: 'none',
      autoCorrect: false,
      keyboardType: 'email-address',
      returnKeyType: 'next',
    },
    password: {
      secureTextEntry: true,
    },
  };

  let typeProps = propsForType[type];

  if (typeof typeProps === 'undefined') {
    typeProps = {};
  }

  return (
    <View style={styles.defaultHolder}>
      <View style={styles.inputHolder}>
        <TextInput
          onChangeText={onChangeText}
          {...typeProps}
          value={value}
          placeholder={placeholder}
          underlineColorAndroid="rgba(0,0,0,0)"
          style={styles.default}
          placeholderTextColor="#C2C2C2"
        />
      </View>
    </View>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,
  valid: PropTypes.bool,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func,
};

export default Input;
