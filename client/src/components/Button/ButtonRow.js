import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import ButtonText from './ButtonText';

const ButtonRow = ({ title, description, onPress, showIcon, showIconNoPress }) => (
  <View>
    {onPress === undefined ? (
      <ButtonText icon={showIconNoPress} title={title} description={description} />
    ) : (
      <TouchableOpacity onPress={onPress}>
        <ButtonText icon={showIcon} title={title} description={description} />
      </TouchableOpacity>
    )}
  </View>
);

ButtonRow.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  onPress: PropTypes.func,
  showIcon: PropTypes.bool,
  showIconNoPress: PropTypes.bool,
};

ButtonRow.defaultProps = {
  showIcon: false,
  showIconNoPress: false,
};

export default ButtonRow;
