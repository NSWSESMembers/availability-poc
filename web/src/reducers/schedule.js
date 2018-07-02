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
  timeSegment: {
    open: false,
    day: 0,
    status: '',
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
        timeSegment: {
          open: true,
          day: action.day,
          status: action.status,
          user: {
            ...action.user,
          },
        },
      };
    case CLOSE_TIME_SEGMENTS_MODAL:
      return {
        ...state,
        timeSegment: {
          ...state.timeSegment,
          open: false,
        },
      };
    case SET_MODAL_TIME_SEGMENT:
      return {
        ...state,
        timeSegment: {
          ...state.timeSegment,
          status: action.status,
        },
      };
    default:
      return state;
  }
};
