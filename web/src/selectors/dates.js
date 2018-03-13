import moment from 'moment';

export default () => {
  const columnData = [{ id: 'name', label: 'Name' }];

  const begin = moment()
    .isoWeekday(1)
    .startOf('week');

  const end = moment()
    .isoWeekday(1)
    .startOf('week')
    .add(7, 'days');

  const diff = end.diff(begin, 'days');

  for (let i = 1; i <= diff; i += 1) {
    begin.add(1, 'days');
    columnData.push({
      id: i,
      label: begin.format('ddd, MMM D'),
      startTime: begin.unix(),
      endTime: begin
        .clone()
        .add(1, 'days')
        .add(-1, 'seconds')
        .unix(),
    });
  }

  return columnData;
};
