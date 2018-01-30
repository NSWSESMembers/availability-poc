import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, TextInput } from 'react-native';
import { ButtonRowNoPress } from '../Button';
import styles from './styles';


class TextInputRow extends Component {
  onChangeText = (text) => {
    this.props.comment = text;
    this.props.onSelect(text);
  };

  render() {
    return (
      <View>
        <ButtonRowNoPress
          title={this.props.title}
        />
        <TextInput
          style={styles.default}
          onChangeText={this.onChangeText}
          value={this.props.comment}
        />
      </View>

    );
  }
}

TextInputRow.propTypes = {
  title: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  comment: PropTypes.string,
};

export default TextInputRow;
