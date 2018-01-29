import moment from 'moment';

const initialMoment = moment()
  .startOf('day')
  .unix();

const initialState = {
  selectedDate: initialMoment,
  isChangingWeek: false,
  selectedRequests: [],
  items: [],
};

const availability = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_AVAILABILITY':
      return {
        ...state,
        items: [...state.items, action.item],
        selectedRequests: [],
        selectedDate: action.item.startDateTime,
      };
    case 'CLEAR_AVAILABILITY':
      return Object.assign({}, state, {
        items: [],
      });
    case 'SET_SELECTED_DATE':
      return Object.assign({}, state, {
        selectedDate: action.date,
        isChangingWeek: false,
      });
    case 'SET_SELECTED_REQUESTS':
      return Object.assign({}, state, {
        selectedRequests: action.groups,
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
