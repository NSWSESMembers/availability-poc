import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const Message = ({ children }) => {
  const messageStyles = [styles.messageContainer];

  return (
    <View style={messageStyles}>
      <Text style={styles.messageText}>{children}</Text>
    </View>
  );
};

Message.propTypes = {
  children: PropTypes.node,
};

export default Message;
