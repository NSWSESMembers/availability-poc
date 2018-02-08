import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const ListItem = ({ title, subtitle, icon, onPress }) => (
  <TouchableOpacity onPress={() => onPress()}>
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
        <Text style={styles.titleText}>{title}</Text>
      </View>
      {icon && <Icon name={icon} size={30} />}
    </View>
  </TouchableOpacity>
);

ListItem.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func,
};

export default ListItem;
