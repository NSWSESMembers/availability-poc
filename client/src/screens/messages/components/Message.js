import moment from 'moment';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  message: {
    flex: 0.8,
    backgroundColor: 'white',
    borderRadius: 6,
    marginHorizontal: 16,
    marginVertical: 2,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
    },
  },
  myMessage: {
    backgroundColor: '#ADD8E6',
  },
  messageUsername: {
    color: 'black',
    fontWeight: 'bold',
    paddingBottom: 12,
  },
  messageTime: {
    color: '#8c8c8c',
    fontSize: 11,
    textAlign: 'right',
  },
  messageSpacer: {
    flex: 0.2,
  },
});

class Message extends PureComponent {
  render() {
    const { message, isCurrentUser } = this.props;

    return (
      <View key={message.id} style={styles.container}>
        {isCurrentUser ? <View style={styles.messageSpacer} /> : undefined }
        <View
          style={[styles.message, isCurrentUser && styles.myMessage]}
        >
          <Text
            style={[
              styles.messageUsername,
            ]}
          >{message.user.displayName}
          </Text>
          <Text>{message.text}</Text>
          <Text style={styles.messageTime}>{moment(message.createdAt).format('h:mm A')}</Text>
        </View>
        {!isCurrentUser ? <View style={styles.messageSpacer} /> : undefined }
      </View>
    );
  }
}

Message.propTypes = {
  message: PropTypes.shape({
    createdAt: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,

    }),
    text: PropTypes.string.isRequired,
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
};

export default Message;
