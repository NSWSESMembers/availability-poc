import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const Container = ({ children }) => <View style={styles.containerFooter}>{children}</View>;

Container.propTypes = {
  // eslint-disable-next-line
  children: PropTypes.any,
};

export default Container;
