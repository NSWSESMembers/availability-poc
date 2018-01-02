import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import { Text } from '../Text';

const Container = ({ title }) => (
  <View style={styles.headerContainer}>
    <Text type="h1White">{title}</Text>
  </View>
);

Container.propTypes = {
  title: PropTypes.string,
};

export default Container;
