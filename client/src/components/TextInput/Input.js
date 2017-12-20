import React from 'react';
import { View, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Octicons';

import styles from './styles';

const Input = (props) => {
  const { title, value, valid, placeholder, type, onChangeText } = props;

  let typeProps = {};
  switch (type) {
    case 'username':
      typeProps = {
        autoCapitalize: 'none',
        autoCorrect: false,
        returnKeyType: 'next',
      };
      break;
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
    <View style={styles.defaultHolder}>
      {title && <Text style={styles.defaultText}>{title.toUpperCase()}</Text>}
      <View style={styles.inputHolder}>
        <TextInput
          onChangeText={onChangeText}
          {...typeProps}
          value={value}
          placeholder={placeholder}
          underlineColorAndroid="rgba(0,0,0,0)"
          style={styles.default}
        />
        {valid && <Icon name="check" size={20} style={styles.validIcon} />}
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
