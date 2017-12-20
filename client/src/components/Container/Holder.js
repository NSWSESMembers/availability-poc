import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const Holder = ({ children, backgroundColor }) => {
  const containerStyles = [styles.holder];

  if (backgroundColor) {
    containerStyles.push({ backgroundColor });
  }

  return <View style={containerStyles}>{children}</View>;
};

Holder.propTypes = {
  children: PropTypes.node,
  backgroundColor: PropTypes.string,
};

export default Holder;
