import React from 'react';

import PropTypes from 'prop-types';
import { View, Button, Modal } from 'react-native';

import styles from './styles';

const BasicModal = ({ visible, closeModal, children }) => (
  <Modal visible={visible} animationType="slide" onRequestClose={closeModal}>
    <View style={styles.container}>
      {children}
      <Button onPress={closeModal} title="Cancel" />
    </View>
  </Modal>
);

BasicModal.propTypes = {
  children: PropTypes.node,
  closeModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default BasicModal;
