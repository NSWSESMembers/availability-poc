import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const Paper = ({ title, text }) => {
  const containerStyles = [styles.container];

  return (
    <View>
      <View style={containerStyles}>
        <View style={styles.textContainer}>
          {title && <Text style={styles.titleText}>{title}</Text>}
          {text && <Text style={styles.text}>{text}</Text>}
        </View>
      </View>
    </View>
  );
};

Paper.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
};

export default Paper;
