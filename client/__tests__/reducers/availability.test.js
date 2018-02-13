import moment from 'moment';
import availabilityReducer from '../../src/state/availability.reducer';
import {
  SET_SELECTED_DATE,
  SET_SELECTED_REQUESTS,
  START_WEEK_CHANGE,
} from '../../src/state/constants';

const startOfToday = moment()
  .startOf('day')
  .unix();

const defaultState = {
  selectedDate: startOfToday,
  isChangingWeek: false,
  selectedRequests: [],
};

test('should set default state', () => {
  const state = availabilityReducer(undefined, { type: '@@INIT' });
  expect(state).toEqual(defaultState);
});

test('should set selected date', () => {
  const selectedDate = moment()
    .add(1, 'days')
    .startOf('day')
    .unix();
  const action = {
    type: SET_SELECTED_DATE,
    date: selectedDate,
  };
  const state = availabilityReducer(undefined, action);
  expect(state).toEqual({
    ...defaultState,
    selectedDate,
  });
});

test('should set selected requests', () => {
  const requests = [
    {
      label: 'Kiama RCR',
      value: 1,
    },
    {
      label: 'Wollongong RCR',
      value: 2,
    },
  ];
  const action = {
    type: SET_SELECTED_REQUESTS,
    requests,
  };
  const state = availabilityReducer(undefined, action);
  expect(state).toEqual({
    ...defaultState,
    selectedRequests: requests,
  });
});

test('should set week change', () => {
  const action = {
    type: START_WEEK_CHANGE,
  };
  const state = availabilityReducer(undefined, action);
  expect(state).toEqual({
    ...defaultState,
    isChangingWeek: true,
  });
});
