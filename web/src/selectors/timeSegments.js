// total time for a given timespan and status
export const timeCount = (timeSegments, { status = 'Available', startTime, endTime }) =>
  timeSegments.reduce(
    timeSegment =>
      (timeSegment.startTime >= startTime &&
      timeSegment.startTime < endTime &&
      timeSegment.status === status
        ? 1
        : 0),
  );

// total people for a given timespan and statuss
export const peopleCount = (timeSegments, { status = 'Available', startTime, endTime }) => {
  const people = [];
  timeSegments.forEach((timeSegment) => {
    if (
      timeSegment.startTime >= startTime &&
      timeSegment.startTime < endTime &&
      timeSegment.status === status
    ) {
      people.push(timeSegment.user.id);
    }
  });
  return people.length;
};

export const searchTimeSegments = (timeSegments, { status, startTime, endTime, userId }) =>
  timeSegments.filter(
    timeSegment =>
      (timeSegment.startTime >= startTime &&
      timeSegment.startTime < endTime &&
      timeSegment.status === status &&
      timeSegment.user.id === userId),
  );

