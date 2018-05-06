import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import styles from './styles';

const UserMarker = ({ name, status, destination, locationTime }) => (
  <View style={styles.container}>
    <View style={styles.bubble}>
      <Text style={[styles.name]}>{name}</Text>
      {destination &&
        <Text style={[styles.destination]}>
          {status.toUpperCase()} {destination.toUpperCase()}
        </Text>}
      <Text style={[styles.locationTime]}>{locationTime}</Text>
    </View>
    <View style={styles.arrowBorder} />
    <View style={styles.arrow} />
  </View>
);

UserMarker.propTypes = {
  name: PropTypes.string.isRequired,
  destination: PropTypes.string,
  status: PropTypes.string,
  locationTime: PropTypes.string,
};

export default UserMarker;
