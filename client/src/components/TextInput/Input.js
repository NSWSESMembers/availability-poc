import React from 'react';
import { View, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const Input = (props) => {
  const { title, value, placeholder, type, onChangeText } = props;

  let typeProps = {};
  switch (type) {
    case 'email':
      typeProps = {
        autoCapitalize: 'none',
        autoCorrect: false,
        keyboardType: 'email-address',
        returnKeyType: 'next',
      };
      break;
    case 'password':
      typeProps = {
        secureTextEntry: true,
      };
      break;
    default:
      break;
  }
  return (
    <View>
      {title && <Text>{title}</Text>}
      <View style={styles.inputHolder}>
        <TextInput
          onChangeText={onChangeText}
          {...typeProps}
          value={value}
          placeholder={placeholder}
          underlineColorAndroid="rgba(0,0,0,0)"
          style={styles.default}
        />
      </View>
    </View>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func,
};

export default Input;
