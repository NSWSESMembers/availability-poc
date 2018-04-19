import React from 'react';
import { TouchableHighlight, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const ListItem = ({
  title,
  bold,
  subtitleEllipsis,
  wide,
  supertitle,
  subtitle,
  detail,
  icon,
  onPress,
}) => {
  const containerStyles = [styles.container];

  if (wide) {
    containerStyles.push({ marginLeft: 0, marginRight: 0 });
  }

  return (
    <TouchableHighlight underlayColor="transparent" onPress={() => onPress()}>
      <View>
        {title && (
        <View style={containerStyles}>
          <View style={styles.textContainer}>
            {supertitle && <Text style={styles.supertitleText}>{supertitle}</Text>}
            {!bold ? (
              <Text style={styles.titleText}>{title}</Text>
            ) : (
              <Text style={styles.titleTextBold}>{title}</Text>
            )}
            {subtitle && (
              <Text style={styles.subtitleText}>
                {subtitleEllipsis && subtitle.length > 80
                  ? `${subtitle.substring(0, 80 - 3)}...`
                  : subtitle}
              </Text>
            )}
          </View>
          {icon && <Icon style={styles.icon} name={icon} size={30} />}
        </View>
      )}
        {detail && (
        <View style={containerStyles}>
          <Text style={styles.detailText}>{detail}</Text>
        </View>
      )}
      </View>
    </TouchableHighlight>
  );
};

ListItem.propTypes = {
  title: PropTypes.string,
  bold: PropTypes.bool,
  subtitleEllipsis: PropTypes.bool,
  wide: PropTypes.bool,
  subtitle: PropTypes.string,
  supertitle: PropTypes.string,
  detail: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func,
};

export default ListItem;
