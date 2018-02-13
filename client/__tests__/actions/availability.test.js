import {
  setSelectedDate,
  setSelectedRequests,
  startWeekChange,
} from '../../src/state/availability.actions';
import {
  SET_SELECTED_DATE,
  SET_SELECTED_REQUESTS,
  START_WEEK_CHANGE,
} from '../../src/state/constants';

test('should setup selected date action object with unix timestamp', () => {
  const action = setSelectedDate(1000);
  expect(action).toEqual({
    type: SET_SELECTED_DATE,
    date: 1000,
  });
});

test('should setup selected requests action object', () => {
  const requestData = [
    {
      label: 'Kiama Rescue Team',
      value: 1,
    },
    {
      label: 'Wollongong Rescue Team',
      value: 2,
    },
  ];
  const action = setSelectedRequests(requestData);
  expect(action).toEqual({
    type: SET_SELECTED_REQUESTS,
    requests: requestData,
  });
});

test('should setup start week change action object', () => {
  const action = startWeekChange();
  expect(action).toEqual({
    type: START_WEEK_CHANGE,
  });
});
