import moment from 'moment';

import { SET_SCHEDULE_SHOW_INFO } from '../state/constants';

const initialMoment = moment()
  .startOf('day')
  .unix();

const initialState = {
  selectedDate: initialMoment,
  isChangingWeek: false,
  selectedRequests: [],
  scheduleShowInfo: false,
};

const availability = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SELECTED_DATE':
      return Object.assign({}, state, {
        selectedDate: action.date,
        isChangingWeek: false,
      });
    case 'SET_SELECTED_REQUESTS':
      return Object.assign({}, state, {
        selectedRequests: action.requests,
      });
    case 'SET_SELECTED_SCHEDULE':
      return Object.assign({}, state, {
        selectedSchedule: action.schedule,
      });
    case 'START_WEEK_CHANGE':
      return Object.assign({}, state, {
        isChangingWeek: true,
      });
    case SET_SCHEDULE_SHOW_INFO:
      return Object.assign({}, state, {
        scheduleShowInfo: action.flag,
      });
    default:
      return state;
  }
};

export default availability;
