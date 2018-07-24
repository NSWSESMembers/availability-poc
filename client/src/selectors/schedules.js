import moment from 'moment';

import distantFuture, { TIME_SEGMENT_TYPE_AVAILABILITY } from '../constants';

import Colors from '../themes/Colors';

export const isSelectorDisabled = (selectionSegments, status, startTime, endTime) => {
  let disabled = false;

  if (status !== '') return disabled;

  const activeSegments = selectionSegments.filter((segment) => {
    if (segment.status !== '') {
      return segment;
    }
    return false;
  });

  if (activeSegments.length === 0) return disabled;

  activeSegments.forEach((segment) => {
    if (startTime < segment.startTime && endTime > segment.startTime) disabled = true;
    if (startTime < segment.endTime && endTime > segment.endTime) disabled = true;
    if (startTime > segment.startTime && endTime < segment.endTime) disabled = true;
    if (startTime === segment.startTime && endTime <= segment.endTime) disabled = true;
    if (startTime >= segment.startTime && endTime === segment.endTime) disabled = true;
  });

  return disabled;
};

export const selectSchedules = (schedules, { userId, startTime, endTime }) => {
  const filteredItems = [];
  schedules.map(schedule =>
    schedule.timeSegments.map((timeSegment) => {
      if (
        (timeSegment.startTime === 0 || timeSegment.startTime >= startTime) &&
        (timeSegment.endTime === distantFuture || timeSegment.endTime <= endTime) &&
        (userId === 0 || timeSegment.user.id === userId) &&
        (timeSegment.type === TIME_SEGMENT_TYPE_AVAILABILITY)
      ) {
        filteredItems.push({
          scheduleId: schedule.id,
          scheduleName: schedule.name,
          scheduleDetail: schedule.details,
          startTime: timeSegment.startTime,
          endTime: timeSegment.endTime,
          id: timeSegment.id,
          status: timeSegment.status,
        });
      }
      return undefined;
    }));
  return filteredItems.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
};

export const selectColor = (status) => {
  const colors = {
    Available: Colors.bgBtnAvailable,
    Unavailable: Colors.bgBtnUnavailable,
    Urgent: Colors.bgBtnUrgent,
  };
  const color = colors[status];
  if (typeof colors === 'undefined') {
    return Colors.bgWhite;
  }
  return color;
};

export const scheduleLabel = (startTime, endTime) => {
  let subtitle = 'Ongoing';
  if (startTime !== 0) {
    const start = moment.unix(startTime).format('YYYY-MM-DD');
    const end = moment.unix(endTime).format('YYYY-MM-DD');
    subtitle = `${start} to ${end}`;
  }
  return subtitle;
};
