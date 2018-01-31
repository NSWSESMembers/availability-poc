import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const Center = ({ children }) => <View style={styles.containerCenter}>{children}</View>;

Center.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Center;
