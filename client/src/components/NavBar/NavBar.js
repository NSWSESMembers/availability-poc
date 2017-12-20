import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import { Text } from '../Text';
import styles from './styles';

const NavBar = ({ onPressBack, rightLinkText, onPressRightLink }) => {
  let btnBack = null;
  let btnRight = null;

  if (onPressBack != null) {
    btnBack = (
      <TouchableOpacity style={styles.btnback} onPress={onPressBack}>
        <Icon name="arrow-left" style={styles.icon} size={16} />
      </TouchableOpacity>
    );
  }

  if (rightLinkText != null && onPressRightLink != null) {
    btnRight = (
      <TouchableOpacity onPress={onPressRightLink}>
        <Text type="h5White">{rightLinkText}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View>
      <View style={styles.bar}>
        <View style={styles.barLeft}>{btnBack}</View>
        <View style={styles.barCentre} />
        <View style={styles.barRight}>{btnRight}</View>
      </View>
    </View>
  );
};

NavBar.propTypes = {
  onPressBack: PropTypes.func,
  rightLinkText: PropTypes.string,
  onPressRightLink: PropTypes.func,
};

export default NavBar;
