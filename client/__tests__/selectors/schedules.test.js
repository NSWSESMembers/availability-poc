import moment from 'moment';
import { selectSchedules } from '../../src/selectors/schedules';
import schedules from '../fixtures/schedules';

test('should return timeSegments for the week', () => {
  const startTime = moment()
    .isoWeekday(1)
    .startOf('isoweek')
    .unix();
  const endTime = moment()
    .isoWeekday(1)
    .endOf('isoweek')
    .unix();
  const userId = 0;
  const result = selectSchedules(schedules, { userId, startTime, endTime });
  expect(result).toEqual([
    {
      scheduleId: schedules[0].id,
      scheduleName: schedules[0].name,
      scheduleDetail: schedules[0].details,
      startTime: schedules[0].timeSegments[0].startTime,
      endTime: schedules[0].timeSegments[0].endTime,
      id: schedules[0].timeSegments[0].id,
      status: schedules[0].timeSegments[0].status,
    },
  ]);
});

test('should return all segments', () => {
  const startTime = 0;
  const endTime = 2147483647;
  const userId = 0;
  const result = selectSchedules(schedules, { userId, startTime, endTime });
  expect(result).toEqual([
    {
      scheduleId: schedules[0].id,
      scheduleName: schedules[0].name,
      scheduleDetail: schedules[0].details,
      startTime: schedules[0].timeSegments[0].startTime,
      endTime: schedules[0].timeSegments[0].endTime,
      id: schedules[0].timeSegments[0].id,
      status: schedules[0].timeSegments[0].status,
    },
    {
      scheduleId: schedules[1].id,
      scheduleName: schedules[1].name,
      scheduleDetail: schedules[1].details,
      startTime: schedules[1].timeSegments[0].startTime,
      endTime: schedules[1].timeSegments[0].endTime,
      id: schedules[1].timeSegments[0].id,
      status: schedules[1].timeSegments[0].status,
    },
  ]);
});
