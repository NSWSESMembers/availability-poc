import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const Footer = ({ children }) => (
  <View style={styles.containerFooter}>
    {children}
  </View>
);

Footer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Footer;
