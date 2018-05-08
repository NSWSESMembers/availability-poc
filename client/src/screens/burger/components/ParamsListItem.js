import PropTypes from 'prop-types';
import React from 'react';
import { Clipboard, Platform, ToastAndroid } from 'react-native';

import { ListItem } from '../../../components/List';


const ParamsListItem = ({ title, detail }) => {
  const onPress = () => {
    Clipboard.setString(detail);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
    }
  };

  return (
    <ListItem
      title={title}
      subtitle={detail}
      onPress={onPress}
    />
  );
};

ParamsListItem.propTypes = {
  title: PropTypes.string,
  detail: PropTypes.string,
};

export default ParamsListItem;
