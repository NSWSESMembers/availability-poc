import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const TextCustom = ({ children, type, style }) => {
  const textType = type || {};
  const textStyle = { style: [styles.default, styles[textType], style || {}] };
  const props = Object.assign({}, this.props, textStyle);

  return <Text {...props}>{children}</Text>;
};

TextCustom.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default TextCustom;
