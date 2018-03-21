import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const ListItemAction = ({ title, subtitle, onPressInfo, onPressAdd }) => {
  const containerStyles = [styles.container];

  return (
    <View style={containerStyles}>
      <View style={styles.textContainer}>
        <Text style={styles.titleTextBold}>{title}</Text>
        {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
      </View>
      <View style={styles.iconContainer}>
        {onPressInfo && (
          <TouchableOpacity onPress={() => onPressInfo()}>
            <View style={styles.iconHolder}>
              <Icon style={styles.icon} name="info-circle" size={30} />
            </View>
          </TouchableOpacity>
        )}
        {onPressAdd && (
          <TouchableOpacity onPress={() => onPressAdd()}>
            <View style={styles.iconHolder}>
              <Icon style={styles.icon} name="plus-circle" size={30} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

ListItemAction.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onPressInfo: PropTypes.func,
  onPressAdd: PropTypes.func,
};

export default ListItemAction;
