import moment from 'moment';

import { STATUS_AVAILABLE, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../config';

export const convertStatus = (status) => {
  switch (status) {
    case STATUS_AVAILABLE:
      return 'AV';
    case STATUS_UNAVAILABLE:
      return 'UN';
    case STATUS_UNLESS_URGENT:
      return 'UR';
    default:
      return 'AV';
  }
};

export const statusColor = (status) => {
  switch (status) {
    case STATUS_AVAILABLE:
      return 'green';
    case STATUS_UNAVAILABLE:
      return 'red';
    case STATUS_UNLESS_URGENT:
      return 'purple';
    default:
      return 'green';
  }
};

export const statusCount = (segments, status) =>
  segments
    .filter(segment => segment.status === status)
    .reduce(
      (prev, next) =>
        prev +
        moment.duration(moment.unix(next.endTime).diff(moment.unix(next.startTime))).asHours(),
      0,
    );
