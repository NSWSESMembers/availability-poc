import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const TextCustom = ({ children }) => (
  <View style={styles.messageContainer}>
    <Text>{children}</Text>
  </View>
);

TextCustom.propTypes = {
  children: PropTypes.node,
};

module.exports = TextCustom;
