import { SET_SELECTED_DATE, SET_SELECTED_REQUESTS, START_WEEK_CHANGE } from '../state/constants';

export const setSelectedDate = date => ({
  type: SET_SELECTED_DATE,
  date,
});

export const setSelectedRequests = requests => ({
  type: SET_SELECTED_REQUESTS,
  requests,
});

export const startWeekChange = () => ({
  type: START_WEEK_CHANGE,
});
