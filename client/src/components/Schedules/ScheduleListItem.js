import React from 'react';
import PropTypes from 'prop-types';

import { scheduleLabel } from '../../selectors/schedules';
import { ListItem } from '../List';

// this component is intended to be used to display basic information about a schedule in a
// <FlatList> and go to schedule detail view when tapped

const ScheduleListItem = ({ schedule, onPress }) => (
  <ListItem
    title={schedule.name}
    subtitle={scheduleLabel(schedule.startTime, schedule.endTime)}
    iconRight="calendar"
    onPress={onPress}
  />
);

ScheduleListItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  schedule: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
  }),
};

export default ScheduleListItem;
