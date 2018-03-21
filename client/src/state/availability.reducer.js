import moment from 'moment';

const initialMoment = moment()
  .startOf('day')
  .unix();

const initialState = {
  selectedDate: initialMoment,
  isChangingWeek: false,
  selectedRequests: [],
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
    default:
      return state;
  }
};

export default availability;
