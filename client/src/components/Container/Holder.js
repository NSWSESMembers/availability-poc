import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const Container = ({ children, margin, marginBot, transparent }) => {
  const containerStyles = [styles.containerHolder];

  if (margin) {
    containerStyles.push({ paddingTop: 20 });
  }
  if (marginBot) {
    containerStyles.push({ paddingBottom: 20 });
  }
  if (transparent) {
    containerStyles.push({ backgroundColor: 'transparent' });
  }

  return <View style={containerStyles}>{children}</View>;
};

Container.propTypes = {
  // eslint-disable-next-line
  children: PropTypes.any,
  margin: PropTypes.bool,
  marginBot: PropTypes.bool,
  transparent: PropTypes.bool,
};

export default Container;
