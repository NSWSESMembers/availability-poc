import React, { Component } from 'react';
import CheckBox from 'react-native-check-box';

import PropTypes from 'prop-types';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { SearchBar } from 'react-native-elements';

import { Center } from '../../components/Container';


import styles from './styles';

class TagModal extends Component {
  state = {
    checked: [],
  }


isChecked = (option) => {
  const index = this.state.checked.indexOf(option.id);
  return index !== -1;
}

Checked = (option) => {
  const newChecked = [...this.state.checked];
  const index = newChecked.indexOf(option.id);
  if (index !== -1) {
    newChecked.splice(index, 1);
  } else {
    newChecked.push(option.id);
  }
  this.setState({ checked: newChecked });
}

renderOption(option, isLastItem) {
  return (
    <TouchableOpacity key={option.id}>
      <View style={[styles.optionStyle, isLastItem &&
            { borderBottomWidth: 0 }]}
      >
        <CheckBox
          style={{ flex: 1, padding: 10 }}
          rightText={option.name}
          onClick={() => this.Checked(option)}
          isChecked={this.isChecked(option)}
        />
      </View>
    </TouchableOpacity>);
}

renderOptionList() {
  const options = this.props.dataIn.map(
    (item, index) => this.renderOption(
      item, index === this.props.dataIn.length - 1,
    ),
  );

  if (options.length) {
    return (
      [options]
    );
  }
  return (
    <Center>
      <Text>No matching tags found</Text>
    </Center>
  );
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
        <View style={styles.overlayStyle}>
          <View style={styles.headerContainer}>
            <TouchableOpacity>
              <View style={styles.headerStyle}>
                <Text style={styles.headerTextStyle}>Select Group Tags</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <SearchBar
              lightTheme
              round
              showLoading={this.props.isLoading}
              containerStyle={styles.searchbar}
              onChangeText={text => this.props.onSearch(text)}
              onClearText={null}
              placeholder="Search"
            />
          </View>
          <View
            style={{
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              alignItems: 'center',
            }}
          />
          <View style={styles.headerContainer} />
          <View style={styles.optionContainerTags}>
            <ScrollView>
              <View style={{ paddingHorizontal: 10 }}>
                {this.renderOptionList()}
              </View>
            </ScrollView>
          </View>
          <View style={styles.cancelContainer}>
            <TouchableOpacity onPress={() => this.props.backModal(this.state.checked)}>
              <View style={styles.cancelStyle}>
                <Text style={styles.cancelTextStyle}>Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
}
TagModal.propTypes = {
  dataIn: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  closeModal: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  backModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default TagModal;
