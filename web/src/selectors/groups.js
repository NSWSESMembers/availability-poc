// filters list of groups by defined filter (location, capability, search, order, orderBy)
export default (
  groups,
  userGroups,
  { locationFilter, capabilityFilter, searchFilter, order, orderBy },
) => {
  let filterGroups = groups;
  if (locationFilter !== '') {
    filterGroups = filterGroups.filter(
      g => g.tags.filter(t => t.id === parseInt(locationFilter, 10)).length > 0,
    );
  }

  if (capabilityFilter !== '') {
    filterGroups = filterGroups.filter(
      g => g.tags.filter(t => t.id === parseInt(capabilityFilter, 10)).length > 0,
    );
  }

  if (searchFilter !== '') {
    filterGroups = filterGroups.filter(g =>
      g.name.toLowerCase().startsWith(searchFilter.toLowerCase()));
  }

  filterGroups = filterGroups.map((group) => {
    const groupMember = userGroups.find(g => g.id === group.id);
    return { ...group, isMember: groupMember !== undefined };
  });

  return order === 'desc'
    ? filterGroups.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
    : filterGroups.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
};
