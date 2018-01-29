import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const ButtonNavBar = ({ icon, onPress }) => (
  <TouchableOpacity onPress={() => onPress()}>
    <Icon name={icon} size={24} style={styles.buttonNavBarIcon} />
  </TouchableOpacity>
);

ButtonNavBar.propTypes = {
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default ButtonNavBar;
