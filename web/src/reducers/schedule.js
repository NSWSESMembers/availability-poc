import moment from 'moment';
import {
  OPEN_DEPLOY_MODAL,
  CLOSE_DEPLOY_MODAL,
  SET_DEPLOY_START_TIME,
  SET_DEPLOY_END_TIME,
  ADD_DEPLOY_PERSON,
  REMOVE_DEPLOY_PERSON,
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
    },
  },
  deploy: {
    open: false,
    startTime: 0,
    endTime: 0,
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
          startTime: action.schedule.startTime,
          endTime: action.schedule.endTime,
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
    case SET_DEPLOY_START_TIME:
      return {
        ...state,
        deploy: {
          ...state.deploy,
          startTime: action.startTime,
        },
      };
    case SET_DEPLOY_END_TIME:
      return {
        ...state,
        deploy: {
          ...state.deploy,
          endTime: action.endTime,
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
          },
        },
      };
    default:
      return state;
  }
};
