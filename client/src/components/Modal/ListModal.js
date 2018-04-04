import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { View, Modal, TouchableOpacity, TouchableWithoutFeedback, Text, ScrollView } from 'react-native';

import styles from './styles';

let componentIndex = 0;

class ListModal extends Component {
  renderOption(option, isLastItem) {
    return (
      <TouchableOpacity key={option.key} onPress={() => this.props.onChange(option)}>
        <View style={[styles.optionStyle, isLastItem &&
            { borderBottomWidth: 0 }]}
        >
          <Text style={styles.optionTextStyle}>{option.label}</Text>
        </View>
      </TouchableOpacity>);
  }

  renderOptionList() {
    const options = this.props.data.map(
      (item, index) => this.renderOption(
        item, index === this.props.data.length - 1,
      ),
    );

    componentIndex += 1;

    return (
      <TouchableWithoutFeedback
        key={`modalSelector${componentIndex}`}
        onPress={() => this.props.closeModal}
      >
        <View style={styles.overlayStyle}>
          <View style={styles.headerContainer}>
            <TouchableOpacity>
              <View style={styles.headerStyle}>
                <Text style={styles.headerTextStyle}>{this.props.title}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.optionContainer}>
            <ScrollView>
              <View style={{ paddingHorizontal: 10 }}>
                {options}
              </View>
            </ScrollView>
          </View>
          <View style={styles.cancelContainer}>
            <TouchableOpacity onPress={this.props.backModal}>
              <View style={styles.cancelStyle}>
                <Text style={styles.cancelTextStyle}>Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>);
  }


  render() {
    return (
      <View>
        <Modal
          transparent
          visible={this.props.visible}
          onRequestClose={this.props.closeModal}
          animationType="fade"
        >
          {this.renderOptionList()}
        </Modal>
      </View>
    );
  }
}
ListModal.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  closeModal: PropTypes.func.isRequired,
  backModal: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default ListModal;
