import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../Icon';

import styles from './styles';

const Paper = ({ title, text, iconRight }) => {
  const containerStyles = [styles.container];

  return (
    <View>
      <View style={containerStyles}>
        <View style={styles.textContainer}>
          {title && <Text style={styles.titleText}>{title}</Text>}
          {text && <Text style={styles.text}>{text}</Text>}
        </View>
        {iconRight && (
          <View style={styles.iconRightHolder}>
            <Icon style={styles.icon} name={iconRight} size={30} />
          </View>
        )}
      </View>
    </View>
  );
};

Paper.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  iconRight: PropTypes.string,
};

export default Paper;
