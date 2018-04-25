import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const Half = ({ children }) => (
  <View style={styles.containerHalf}>
    {children}
  </View>
);

Half.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Half;
