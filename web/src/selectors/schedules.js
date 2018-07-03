export default (schedules, { capability, groupId, name, order, orderBy }) => {
  let filterSchedules = schedules;
  if (capability !== '') {
    filterSchedules = filterSchedules.filter(
      g => g.tags.filter(t => t.id === parseInt(capability, 10)).length > 0,
    );
  }

  const filteredItems = [];
  filterSchedules.forEach((schedule) => {
    if (
      (groupId === '' || parseInt(groupId, 10) === schedule.group.id) &&
      (name === '' || schedule.name.toUpperCase().includes(name.toUpperCase()))
    ) {
      filteredItems.push({
        ...schedule,
      });
    }
  });

  return order === 'desc'
    ? filteredItems.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
    : filteredItems.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
};

export const scheduleLabel = text => text.charAt(0).toUpperCase() + text.slice(1);
