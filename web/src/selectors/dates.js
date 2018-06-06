import moment from 'moment';
import numbers from '../constants';

export const dateColumns = (startTime, endTime) => {
  const columnData = [{ id: 'name', label: 'Name' }];

  const diff = endTime.diff(startTime, 'days');

  for (let i = 1; i <= diff; i += 1) {
    columnData.push({
      id: i,
      label: startTime.format('ddd, MMM D'),
      startTime: startTime.unix(),
      endTime: startTime
        .clone()
        .add(1, 'days')
        .unix(),
    });
    startTime.add(1, 'days');
  }
  return columnData;
};

export const dateScheduleLabel = (startTime, endTime) => {
  if (startTime === numbers.distantPast && endTime === numbers.distantFuture) {
    return 'Ongoing';
  }

  return `${moment.unix(startTime).format('LL')} - 
    ${moment.unix(endTime).format('LL')}`;
};

export const dateRangeLabel = (startTime, endTime) => `${moment.unix(startTime).format('DD MMM')} - 
    ${moment.unix(endTime).format('DD MMM')}`;

export default () => {
  const begin = moment()
    .isoWeekday(1)
    .startOf('week');

  const end = moment()
    .isoWeekday(1)
    .startOf('week')
    .add(7, 'days');

  return dateColumns(begin, end);
};
