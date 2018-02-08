import React from 'react';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import PropTypes from 'prop-types';

const Segment = ({ values = [], selectedIndex, handleIndexChange }) => (
  <SegmentedControlTab
    values={values}
    selectedIndex={selectedIndex}
    onTabPress={handleIndexChange}
    tabStyle={{ backgroundColor: 'white', borderColor: '#1e3c78' }}
    activeTabStyle={{ backgroundColor: '#1e3c78' }}
    tabTextStyle={{ color: '#1e3c78' }}
  />
);

Segment.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string),
  selectedIndex: PropTypes.number,
  handleIndexChange: PropTypes.func,
};

export default Segment;
