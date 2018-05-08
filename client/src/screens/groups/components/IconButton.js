import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

import Icon from '../../../components/Icon';
import styles from './styles';


const IconButton = ({ onPress, icon, text }) => (

  <TouchableOpacity
    style={styles.iconRightHolder}
    onPress={onPress}
  >
    <Icon style={styles.icon} name={icon} size={25} />
    <Text style={styles.leaveGroupText}>{text}</Text>
  </TouchableOpacity>
);

IconButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default IconButton;
