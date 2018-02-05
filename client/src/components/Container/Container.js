import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const Container = ({ children, isAlt }) => {
  let containerStyles = [styles.container];

  if (isAlt === true) {
    containerStyles = [styles.containerAlt];
  }

  return (
    <View style={containerStyles}>
      {children}
    </View>
  );
};

Container.propTypes = {
  children: PropTypes.node,
  isAlt: PropTypes.bool,
};

Container.defaultProps = {
  isAlt: false,
};

export default Container;
