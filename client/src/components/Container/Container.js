import PropTypes from 'prop-types';
import React from 'react';
import { StatusBar, View } from 'react-native';
import styles from './styles';

const Container = ({ children, isAlt }) => {
  let containerStyles = [styles.container];

  if (isAlt === true) {
    containerStyles = [styles.containerAlt];
  }

  return (
    <View style={containerStyles}>
      <StatusBar barStyle="light-content" />
      {children}
    </View>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  isAlt: PropTypes.bool,
};

Container.defaultProps = {
  isAlt: false,
};

export default Container;
