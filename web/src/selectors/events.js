export default (events, groupId, order, orderBy) => {
  const filteredEvents = events
    .filter(event => groupId === '' || event.group.id === parseInt(groupId, 10))
    .map(event => ({ ...event, groupName: event.group.name }));
  return order === 'desc'
    ? filteredEvents.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
    : filteredEvents.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
};
