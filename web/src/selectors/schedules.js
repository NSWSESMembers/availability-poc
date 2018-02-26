export default (schedules, { groupId, order, orderBy }) => {
  const filteredItems = [];
  schedules.forEach((schedule) => {
    if (groupId === '' || groupId === schedule.group.id) {
      filteredItems.push({
        id: schedule.id,
        name: schedule.name,
        group: schedule.group.name,
        type: schedule.startTime === 0 ? 'Ongoing' : 'Date Range',
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      });
    }
  });

  return order === 'desc'
    ? filteredItems.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
    : filteredItems.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
};
