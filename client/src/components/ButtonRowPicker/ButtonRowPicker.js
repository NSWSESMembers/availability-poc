import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ModalSelector from 'react-native-modal-selector';
import { View } from 'react-native';

import data from '../../fixtures/status';
import { ButtonRow } from '../Button';

class ButtonRowPicker extends Component {
  onConfirm = (option) => {
    this.props.selected = option.label;
    this.props.onSelect(option.label);
  };

  render() {
    return (
      <View>
        <ModalSelector data={data} onChange={this.onConfirm}>
          <ButtonRow
            title={this.props.title}
            showIconNoPress={this.props.showIcon}
            description={`For this time period I am '${this.props.selected}'`}
          />
        </ModalSelector>
      </View>
    );
  }
}

ButtonRowPicker.propTypes = {
  title: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  showIcon: PropTypes.bool,
};

ButtonRowPicker.defaultProps = {
  showIcon: false,
};

export default ButtonRowPicker;
