import React from 'react';
import PropTypes from 'prop-types';

import { ListItem } from '../List';

// this component is intended to be used to display basic information about an event in a
// <FlatList> and go to event detail view when tapped
const EventListItem = ({ event, urgent, onPress }) => {
  const titleNumberOfLines = urgent ? 2 : 1;
  const subtitleNumberOfLines = urgent ? 3 : 2;

  return (
    <ListItem
      title={event.name}
      titleNumberOfLines={titleNumberOfLines}
      subtitle={event.details}
      subtitleNumberOfLines={subtitleNumberOfLines}
      iconRight={urgent ? 'exclamation-triangle' : 'bullhorn'}
      onPress={onPress}
      urgent={urgent}
    />
  );
};

EventListItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  event: PropTypes.shape({
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
  }),
  urgent: PropTypes.bool,
};

export default EventListItem;
