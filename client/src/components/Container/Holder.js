import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const Container = ({
  children,
  margin,
  marginVertical,
  marginTop,
  paddingVertical,
  wide,
  marginBot,
  transparent,
}) => {
  const containerStyles = [styles.containerHolder];

  if (paddingVertical) {
    containerStyles.push({ paddingTop: 8, paddingBottom: 8 });
  }

  if (marginVertical) {
    containerStyles.push({ marginTop: 8, marginBottom: 8 });
  }

  if (marginTop) {
    containerStyles.push({ marginTop: 8 });
  }

  if (margin) {
    containerStyles.push({ paddingTop: 20 });
  }

  if (wide) {
    containerStyles.push({ paddingLeft: 5, paddingRight: 5 });
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
  children: PropTypes.node.isRequired,
  paddingVertical: PropTypes.bool,
  marginTop: PropTypes.bool,
  marginVertical: PropTypes.bool,
  margin: PropTypes.bool,
  marginBot: PropTypes.bool,
  wide: PropTypes.bool,
  transparent: PropTypes.bool,
};

export default Container;
