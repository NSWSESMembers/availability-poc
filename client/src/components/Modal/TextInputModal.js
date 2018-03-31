import React from 'react';

import PropTypes from 'prop-types';
import { View, Modal, TouchableOpacity, TouchableWithoutFeedback, Text, TextInput } from 'react-native';

import styles from './styles';

const TextInputModal = ({ closeModal, backModal, onChangeText, visible, onSave }) => (
  <View>
    <Modal
      transparent
      visible={visible}
      onRequestClose={closeModal}
      animationType="fade"
    >
      <TouchableWithoutFeedback
        onPress={() => closeModal}
      >
        <View style={styles.overlayStyle}>
          <View style={styles.headerContainer}>
            <TouchableOpacity>
              <View style={styles.headerStyle}>
                <Text style={styles.headerTextStyle}>Availability Comments</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.optionContainer}>
            <View>
              <View style={{ paddingHorizontal: 10 }}>
                <TextInput
                  style={styles.etaInput}
                  placeholder="Notes.."
                  onChangeText={onChangeText}
                />
              </View>
            </View>
          </View>
          <View style={styles.nextContainer}>
            <TouchableOpacity onPress={onSave}>
              <View style={styles.nextStyle}>
                <Text style={styles.nextTextStyle}>Next</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.cancelContainer}>
            <TouchableOpacity onPress={backModal}>
              <View style={styles.cancelStyle}>
                <Text style={styles.cancelTextStyle}>Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  </View>
);

TextInputModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  backModal: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default TextInputModal;
