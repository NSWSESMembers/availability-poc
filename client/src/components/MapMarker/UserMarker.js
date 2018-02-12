import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import styles from './styles';

const UserMarker = ({ name }) => (
  <View style={styles.container}>
    <View style={styles.bubble}>
      <Text style={[styles.name]}>{name}</Text>
    </View>
    <View style={styles.arrowBorder} />
    <View style={styles.arrow} />
  </View>
);

UserMarker.propTypes = {
  name: PropTypes.string.isRequired,
};

export default UserMarker;
