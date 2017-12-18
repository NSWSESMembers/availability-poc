import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const Container = ({ title }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.header}>{title}</Text>
  </View>
);

Container.propTypes = {
  title: PropTypes.string,
};

export default Container;
