import moment from 'moment-timezone';

import { scheduleLabel } from '../schedules';

test('schedule label', () => {
  // we have to set the timezone else the snapshot will differ between developers/CI hosts
  moment.tz.setDefault('UTC');
  const startTime = moment('2018-04-23 06:00:00').unix();
  const endTime = moment('2018-04-23 18:00:00').unix();
  expect(
    scheduleLabel(startTime, endTime),
  ).toMatchSnapshot();
  expect(
    scheduleLabel(0, endTime),
  ).toMatchSnapshot();
  expect(
    scheduleLabel(startTime, 0),
  ).toMatchSnapshot();
});
