import { SCHEDULE_TYPE_REMOTE } from '../config';

export default (schedules, { groupId, name, order, orderBy }) => {
  const filteredItems = [];
  schedules.forEach((schedule) => {
    if (
      (groupId === '' || parseInt(groupId, 10) === schedule.group.id) &&
      (name === '' || schedule.name.toUpperCase().includes(name.toUpperCase()))
    ) {
      filteredItems.push({
        id: schedule.id,
        name: schedule.name,
        type: schedule.type,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        group: {
          id: schedule.group.id,
          name: schedule.group.name,
        },
      });
    }
  });

  return order === 'desc'
    ? filteredItems.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
    : filteredItems.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
};

export const scheduleLabel = (text) => {
  if (text === SCHEDULE_TYPE_REMOTE) {
    return text.toUpperCase();
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
};
