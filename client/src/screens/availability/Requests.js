import React, { Component } from 'react';
import { View } from 'react-native';
import SelectMultiple from 'react-native-select-multiple';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setSelectedRequests } from '../../state/availability.actions';
import requestsData from '../../fixtures/groups';

class Requests extends Component {
  static navigationOptions = () => ({
    title: 'Select Request(s)',
  });

  onSelectionChange = (selectedRequests) => {
    this.props.dispatch(setSelectedRequests(selectedRequests));
  };

  render() {
    return (
      <View>
        <SelectMultiple
          items={requestsData.data}
          selectedItems={this.props.selectedRequests}
          onSelectionsChange={this.onSelectionChange}
        />
      </View>
    );
  }
}

Requests.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedRequests: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
};

const mapStateToProps = state => ({
  selectedRequests: state.availability.selectedRequests,
});

export default connect(mapStateToProps)(Requests);
