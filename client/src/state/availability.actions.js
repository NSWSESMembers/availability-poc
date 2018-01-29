import {
  ADD_AVAILABILITY,
  CLEAR_AVAILABILITY,
  SET_SELECTED_DATE,
  SET_SELECTED_REQUESTS,
  START_WEEK_CHANGE,
} from '../state/constants';

export const addAvailability = item => ({
  type: ADD_AVAILABILITY,
  item,
});

export const clearAvailability = () => ({
  type: CLEAR_AVAILABILITY,
});

export const setSelectedDate = date => ({
  type: SET_SELECTED_DATE,
  date,
});

export const setSelectedRequests = groups => ({
  type: SET_SELECTED_REQUESTS,
  groups,
});

export const startWeekChange = () => ({
  type: START_WEEK_CHANGE,
});
