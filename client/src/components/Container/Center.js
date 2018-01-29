import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const Center = ({ children }) => <View style={styles.containerCenter}>{children}</View>;

Center.propTypes = {
  // eslint-disable-next-line
  children: PropTypes.any,
};

export default Center;
