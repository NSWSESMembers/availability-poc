import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const Container = ({ children }) => <View style={styles.containerFooter}>{children}</View>;

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
