import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../Icon';

import styles from './styles';

const ListItem = ({
  title,
  titleNumberOfLines,
  wide,
  supertitle,
  subtitle,
  subtitleNumberOfLines,
  detail,
  iconRight,
  iconLeft,
  onPress,
  urgent,
}) => {
  const containerStyles = [styles.container];

  if (wide) {
    containerStyles.push({ marginLeft: 0, marginRight: 0 });
  }

  if (urgent) {
    containerStyles.push({ backgroundColor: '#FFDDDD' });
  }

  return (
    <TouchableOpacity onPress={() => onPress()}>
      {title && (
        <View style={containerStyles}>
          {iconLeft && (
            <View style={styles.iconLeftHolder}>
              <Icon style={styles.icon} name={iconLeft} size={30} />
            </View>
          )}
          <View style={styles.textContainer}>
            {supertitle && (
              <Text style={styles.supertitleText}>
                {supertitle}
              </Text>
            )}
            <Text style={styles.titleTextBold} numberOfLines={titleNumberOfLines}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitleText} numberOfLines={subtitleNumberOfLines}>
                {subtitle}
              </Text>
            )}
          </View>
          {iconRight && (
            <View style={styles.iconRightHolder}>
              <Icon style={styles.icon} name={iconRight} size={30} />
            </View>
          )}
        </View>
      )}
      {detail && (
        <View style={containerStyles}>
          <Text style={styles.detailText}>{detail}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  title: PropTypes.string,
  titleNumberOfLines: PropTypes.number,
  wide: PropTypes.bool,
  urgent: PropTypes.bool,
  subtitle: PropTypes.string,
  subtitleNumberOfLines: PropTypes.number,
  supertitle: PropTypes.string,
  detail: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  onPress: PropTypes.func,
};

export default ListItem;
