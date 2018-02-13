export default (schedules, { startTime, endTime }) => {
  const filteredItems = [];
  schedules.map(schedule =>
    schedule.timeSegments.map((timeSegment) => {
      if (
        (timeSegment.startTime === 0 || timeSegment.startTime >= startTime) &&
        (timeSegment.endTime === 2147483647 || timeSegment.endTime <= endTime)
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

// need a better way to do this other than map - e.g. reduce multidimension array ?
