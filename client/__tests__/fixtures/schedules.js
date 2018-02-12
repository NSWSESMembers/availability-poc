import moment from 'moment';

const today = moment();
const nextWeek = moment().add(7, 'days');

export default [
  {
    id: 1,
    name: 'Ongoing Schedule',
    details: 'This is my first schedule (ongoing)',
    startTime: 0,
    endTime: 2147483647,
    timeSegments: [
      // current week availability
      {
        id: 1,
        status: 'Available',
        startTime: today.unix(),
        endTime: today
          .clone()
          .add(1, 'hours')
          .unix(),
      },
    ],
  },
  {
    id: 2,
    name: 'Future Schedule',
    details: 'This is my second schedule (future)',
    startTime: nextWeek.unix(),
    endTime: nextWeek
      .clone()
      .add(1, 'days')
      .unix(),
    timeSegments: [
      // next week availability
      {
        id: 2,
        status: 'Unavailable',
        startTime: nextWeek.unix(),
        endTime: nextWeek
          .clone()
          .add(1, 'days')
          .unix(),
      },
    ],
  },
];
