import React, { Component } from 'react';
import GridView from 'react-native-super-grid';

import PropTypes from 'prop-types';
import { View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import Icon from '../../components/Icon';
import styles from './styles';

let componentIndex = 0;

class IconModal extends Component {
  renderOptionList() {
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
            <GridView
              itemDimension={45}
              items={this.props.data}
              renderItem={item => (
                <TouchableOpacity onPress={() => this.props.onChange(item)}>
                  <View style={this.props.Selected === item.icon ?
                    styles.itemContainerSelected : styles.itemContainer}
                  >
                    <Icon size={30} name={item.icon} />
                  </View>
                </TouchableOpacity>
              )}
            />
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
IconModal.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  Selected: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  backModal: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default IconModal;
