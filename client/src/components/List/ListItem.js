import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const ListItem = ({ title, bold, wide, supertitle, subtitle, icon, onPress }) => (
  <TouchableOpacity onPress={() => onPress()}>
    <View style={wide ? styles.containerWide : styles.container}>
      <View style={styles.textContainer}>
        {supertitle && <Text style={styles.supertitleText}>{supertitle}</Text>}
        {!bold ?
          <Text style={styles.titleText}>{title}</Text>
        : <Text style={styles.titleTextBold}>{title}</Text>
        }
        {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
      </View>
      {icon && <Icon style={styles.icon} name={icon} size={30} />}
    </View>
  </TouchableOpacity>
);

ListItem.propTypes = {
  title: PropTypes.string,
  bold: PropTypes.bool,
  wide: PropTypes.bool,
  subtitle: PropTypes.string,
  supertitle: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func,
};

export default ListItem;
