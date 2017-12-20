import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, View, Text } from 'react-native';

import { Button } from './';

import styles from './styles';

const NextButton = ({ onPress, disabled }) => (
  <KeyboardAvoidingView behavior="position" style={styles.btnSubmitHolder}>
    <Button onPress={onPress} type="submit" disabled={disabled} />
  </KeyboardAvoidingView>
);

NextButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
};

export default NextButton;
