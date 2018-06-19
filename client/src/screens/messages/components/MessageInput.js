import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';

import Icon from '../../../components/Icon';


const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    backgroundColor: '#f5f1ee',
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 11,
    borderColor: '#dbdbdb',
    borderRadius: 15,
    borderWidth: 1,
    color: 'black',
    height: 32,
    paddingHorizontal: 8,
  },
  sendButtonContainer: {
    paddingVertical: 6,
  },
  buttonIconContainer: {
    backgroundColor: 'green',
    alignItems: 'center',
    height: 32,
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    margin: 5,
  },
  sendButton: {
    flex: 1,
    height: 32,
    width: 32,
  },
  iconStyle: {
    marginRight: 0, // default is 12
  },
});

const sendButton = send => (
  <TouchableOpacity onPress={send} style={styles.buttonIconContainer}>
    <Icon size={10} name="fa-send" color="white" />
  </TouchableOpacity>
);

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  send = () => {
    if (this.state.text) {
      this.props.send(this.state.text);
      this.textInput.clear();
      this.textInput.blur();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={(ref) => { this.textInput = ref; }}
            onChangeText={text => this.setState({ text })}
            style={styles.input}
            placeholder="Type your message here!"
          />
        </View>
        <View style={styles.sendButtonContainer} />
        {sendButton(this.send)}
      </View>
    );
  }
}

MessageInput.propTypes = {
  send: PropTypes.func.isRequired,
};

export default MessageInput;
