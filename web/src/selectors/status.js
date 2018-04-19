import moment from 'moment';

export const convertStatus = (status) => {
  switch (status) {
    case 'Available':
      return 'AV';
    case 'Unavailable':
      return 'UN';
    case 'Unavailable - unless urgent':
      return 'UR';
    default:
      return 'AV';
  }
};

export const statusColor = (status) => {
  switch (status) {
    case 'Available':
      return 'green';
    case 'Unavailable':
      return 'red';
    case 'Unavailable - unless urgent':
      return 'purple';
    default:
      return 'green';
  }
};

export const statusCount = (segments, status) => segments.filter(
  segment => segment.status === status,
).reduce((prev, next) =>
  prev + moment.duration(moment.unix(next.endTime)
    .diff(moment.unix(next.startTime))).asHours(), 0);

