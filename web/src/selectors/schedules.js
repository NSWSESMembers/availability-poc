export default (schedules, { groupId, name, order, orderBy }) => {
  const filteredItems = [];
  schedules.forEach((schedule) => {
    if (
      (groupId === '' || groupId === schedule.group.id) &&
      (name === '' || schedule.name.toUpperCase().includes(name.toUpperCase()))
    ) {
      filteredItems.push({
        id: schedule.id,
        name: schedule.name,
        type: schedule.startTime === 0 ? 'Ongoing' : 'Date Range',
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
