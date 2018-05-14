import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Icon from '../Icon';
import styles from './styles';

const IconMarker = ({ name }) => (
  <View>
    <View style={styles.circle} >
      <Icon
        name={name}
        size={20}
        color="white"
        style={{ textAlign: 'center', textAlignVertical: 'center', includeFontPadding: false }}
      />
    </View>
    <View style={styles.arrowBorderBlack} />
    <View style={styles.arrow} />
  </View>
);

IconMarker.propTypes = {
  name: PropTypes.string.isRequired,
};

export default IconMarker;
