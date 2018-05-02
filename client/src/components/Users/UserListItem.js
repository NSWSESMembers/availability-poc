import React from 'react';
import PropTypes from 'prop-types';

import { ListItem } from '../List';

// this component is intended to be used to display basic information about a user in a
// <FlatList> and go to user detail view when tapped

const UserListItem = ({ user, onPress }) => (
  <ListItem
    title={user.displayName}
    subtitle={user.username}
    iconRight="user"
    onPress={onPress}
  />
);

UserListItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }),
};

export default UserListItem;
