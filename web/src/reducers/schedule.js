import moment from 'moment';
import {
  OPEN_DEPLOY_MODAL,
  EDIT_DEPLOY_MODAL,
  CLOSE_DEPLOY_MODAL,
  SET_DEPLOY,
  ADD_DEPLOY_PERSON,
  REMOVE_DEPLOY_PERSON,
  CLEAR_DEPLOY_PERSON,
  ADD_DEPLOY_TAG,
  REMOVE_DEPLOY_TAG,
  OPEN_TIME_SEGMENTS_MODAL,
  CLOSE_TIME_SEGMENTS_MODAL,
  SET_MODAL_TIME_SEGMENT,
} from '../actions/schedule';

const initialState = {
  timeSegments: {
    open: false,
    day: 0,
    timeSegment: {
      id: 0,
      status: '',
      startTime: 0,
      endTime: 0,
      note: '',
    },
  },
  deploy: {
    open: false,
    id: 0,
    scheduleId: 0,
    userId: 0,
    startTime: 0,
    endTime: 0,
    note: '',
    tags: [],
    tagsSelected: [],
    peopleSelected: [],
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_DEPLOY_MODAL:
      return {
        ...state,
        deploy: {
          ...state.deploy,
          open: true,
          id: 0,
          scheduleId: action.schedule.id,
          startTime: action.schedule.startTime,
          endTime: action.schedule.endTime,
          userId: 0,
          tags: action.schedule.tags,
          tagsSelected: [],
        },
      };
    case EDIT_DEPLOY_MODAL:
      return {
        ...state,
        deploy: {
          ...state.deploy,
          open: true,
          id: action.timeSegment.id,
          scheduleId: action.schedule.id,
          startTime: action.timeSegment.startTime,
          endTime: action.timeSegment.endTime,
          userId: action.timeSegment.user.id,
          tags: action.schedule.tags,
          tagsSelected: [],
        },
      };
    case CLOSE_DEPLOY_MODAL:
      return {
        ...state,
        deploy: {
          ...state.deploy,
          open: false,
        },
      };
    case SET_DEPLOY:
      return {
        ...state,
        deploy: {
          ...state.deploy,
          startTime: action.startTime,
          endTime: action.endTime,
          note: action.note,
        },
      };
    case ADD_DEPLOY_PERSON:
      return {
        ...state,
        deploy: {
          ...state.deploy,
          peopleSelected: [...state.deploy.peopleSelected, action.id],
        },
      };
    case ADD_DEPLOY_TAG:
      return {
        ...state,
        deploy: {
          ...state.deploy,
          tagsSelected: [...state.deploy.tagsSelected, action.id],
        },
      };
    case REMOVE_DEPLOY_PERSON:
      return {
        ...state,
        deploy: {
          ...state.deploy,
          peopleSelected: state.deploy.peopleSelected.filter(item => item !== action.id),
        },
      };
    case CLEAR_DEPLOY_PERSON:
      return {
        ...state,
        deploy: {
          ...state.deploy,
          peopleSelected: [],
        },
      };
    case REMOVE_DEPLOY_TAG:
      return {
        ...state,
        deploy: {
          ...state.deploy,
          tagsSelected: state.deploy.tagsSelected.filter(item => item !== action.id),
        },
      };
    case OPEN_TIME_SEGMENTS_MODAL:
      return {
        ...state,
        timeSegments: {
          scheduleId: action.scheduleId,
          open: true,
          day: action.day,
          timeSegment: {
            id: action.timeSegment !== undefined ? action.timeSegment.id : 0,
            status: action.status,
            startTime:
              action.timeSegment !== undefined
                ? action.timeSegment.startTime
                : moment
                  .unix(action.day)
                  .add(9, 'hours')
                  .unix(),
            endTime:
              action.timeSegment !== undefined
                ? action.timeSegment.endTime
                : moment
                  .unix(action.day)
                  .add(17, 'hours')
                  .unix(),
            note: action.timeSegment !== undefined ? action.timeSegment.note : '',
          },
          user: {
            ...action.user,
          },
        },
      };
    case CLOSE_TIME_SEGMENTS_MODAL:
      return {
        ...state,
        timeSegments: {
          ...state.timeSegments,
          scheduleId: 0,
          open: false,
        },
      };
    case SET_MODAL_TIME_SEGMENT:
      return {
        ...state,
        timeSegments: {
          ...state.timeSegments,
          timeSegment: {
            ...state.timeSegments.timeSegment,
            status: action.status,
            startTime: action.startTime,
            endTime: action.endTime,
            note: action.note,
          },
        },
      };
    default:
      return state;
  }
};
