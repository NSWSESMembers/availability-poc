import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import ParamsListItem from './ParamsListItem';


class ParamsList extends Component {
  renderItem = ({ item }) => (
    <ParamsListItem
      {...item}
    />
  )

  render() {
    const {
      deviceInfo,
      packageInfo,
      user,
      device,
      auth,
    } = this.props;

    const items = [
      {
        title: 'Device Info',
        detail: deviceInfo,
      },
      {
        title: 'Package Info',
        detail: packageInfo,
      },
      {
        title: 'Current auth state',
        detail: auth,
      },
      {
        title: 'Current device query',
        detail: device,
      },
      {
        title: 'Current user query',
        detail: user,
      },
    ];

    return (
      <FlatList
        data={items}
        keyExtractor={item => item.title}
        renderItem={this.renderItem}
      />
    );
  }
}

ParamsList.propTypes = {
  deviceInfo: PropTypes.string,
  packageInfo: PropTypes.string,
  auth: PropTypes.string,
  user: PropTypes.string,
  device: PropTypes.string,
};

export default ParamsList;
