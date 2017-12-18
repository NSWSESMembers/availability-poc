import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const Container = ({ children, backgroundColor }) => {
  const containerStyles = [styles.container];

  if (backgroundColor) {
    containerStyles.push({ backgroundColor });
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={containerStyles}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

Container.propTypes = {
  children: PropTypes.node,
  backgroundColor: PropTypes.string,
};

export default Container;
