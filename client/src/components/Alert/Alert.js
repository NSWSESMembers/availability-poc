import React, { Component } from 'react';
import { TouchableOpacity, View, Animated } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Colors from './../../themes/Colors';
import { Text } from '../Text';
import styles from './styles';

const bottom = -100;

class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deltaY: new Animated.Value(0),
    };
    this.hide = this.hide.bind(this);
  }
  _timeout = false;

  show() {
    Animated.timing(this.state.deltaY, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.hide();
    }, 3000);
  }

  hide() {
    Animated.timing(this.state.deltaY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }

  render() {
    let title = 'Error';
    let txtColor = Colors.txtError;
    let message = 'Server error, something went wrong.';
    const status = this.props.status || 'error';

    if (status === 'success') {
      txtColor = Colors.txtSuccess;
      title = 'Success';
      message = 'Data submitted successfully.';
    }

    title = this.props.title || title;
    message = this.props.message || message;

    return (
      <Animated.View
        {...this.props}
        style={[
          styles.holder,
          {
            transform: [
              {
                translateY: this.state.deltaY.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, bottom - 25],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.titleHolder}>
          <Text type="h5" style={{ color: txtColor }}>
            {title}
          </Text>
          <TouchableOpacity onPress={this.hide}>
            <Icon name="close" size={20} color={txtColor} />
          </TouchableOpacity>
        </View>
        <Text type="span" style={[styles.message, { color: txtColor }]}>
          {message}
        </Text>
      </Animated.View>
    );
  }
}

Alert.propTypes = {
  status: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
};

module.exports = Alert;
