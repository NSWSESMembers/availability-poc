import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FlatList } from 'react-native';

import { Container } from '../../../components/Container';
import { ListItem } from '../../../components/List';

class Menu extends Component {
  renderItem = ({ item }) => (
    <ListItem
      bold
      {...item}
    />
  )

  render() {
    const { props } = this;
    const items = [
      {
        title: 'User Profile',
        subtitle: 'Modify your display name and preferences',
        iconLeft: 'user-circle',
        onPress: props.onShowUserProfile,
      },
      {
        title: 'Force location update',
        subtitle: 'Test the location tracking system',
        iconLeft: 'compass',
        onPress: props.onUpdateLocation,
      },
      {
        title: 'Check for updates',
        subtitle: 'Install a new version of the app, if available',
        iconLeft: 'download',
        onPress: props.onCheckForUpdate,
      },
      {
        title: 'Submit feedback',
        subtitle: 'Please post in the Facebook feedback group',
        iconLeft: 'comments',
        onPress: props.onSubmitFeedback,
      },
      {
        title: 'Test Bugsnag',
        subtitle: 'Submit a mock bug report to Bugsnag',
        iconLeft: 'bug',
        onPress: props.onTestBugsnag,
      },
      {
        title: 'Internal Parameters',
        subtitle: 'Display the app version and other details',
        iconLeft: 'info-circle',
        onPress: props.onShowParams,
      },
      {
        title: 'Logout',
        subtitle: 'Sign out of this device',
        iconLeft: 'times-circle',
        onPress: props.onLogout,
      },
    ];

    return (
      <Container>
        <FlatList
          data={items}
          keyExtractor={item => item.title}
          renderItem={this.renderItem}
        />
      </Container>
    );
  }
}

Menu.propTypes = {
  onShowUserProfile: PropTypes.func.isRequired,
  onUpdateLocation: PropTypes.func.isRequired,
  onCheckForUpdate: PropTypes.func.isRequired,
  onSubmitFeedback: PropTypes.func.isRequired,
  onTestBugsnag: PropTypes.func.isRequired,
  onShowParams: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Menu;
