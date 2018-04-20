import React from 'react';
import PropTypes from 'prop-types';

import { ListItem } from '../List';

// this component is intended to be used to display basic information about an event in a
// <FlatList> and go to event detail view when tapped
const EventListItem = ({ event, onPress }) => (
  <ListItem
    title={event.name}
    bold
    subtitle={event.details}
    subtitleEllipsis
    icon="bullhorn"
    onPress={onPress}
  />
);

EventListItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  event: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default EventListItem;
