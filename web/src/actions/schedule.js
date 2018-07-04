export const OPEN_DEPLOY_MODAL = 'OPEN_DEPLOY_MODAL';
export const CLOSE_DEPLOY_MODAL = 'CLOSE_DEPLOY_MODAL';
export const SET_DEPLOY_START_TIME = 'SET_DEPLOY_START_TIME';
export const SET_DEPLOY_END_TIME = 'SET_DEPLOY_END_TIME';
export const ADD_DEPLOY_PERSON = 'ADD_DEPLOY_PERSON';
export const REMOVE_DEPLOY_PERSON = 'REMOVE_DEPLOY_PERSON';
export const ADD_DEPLOY_TAG = 'ADD_DEPLOY_TAG';
export const REMOVE_DEPLOY_TAG = 'REMOVE_DEPLOY_TAG';

export const OPEN_TIME_SEGMENTS_MODAL = 'OPEN_TIME_SEGMENTS_MODAL';
export const CLOSE_TIME_SEGMENTS_MODAL = 'CLOSE_TIME_SEGMENTS_MODAL';
export const SET_MODAL_TIME_SEGMENT = 'SET_MODAL_TIME_SEGMENT';

// Deployments

export const openDeployModal = schedule => ({
  type: OPEN_DEPLOY_MODAL,
  schedule,
});

export const closeDeployModal = () => ({
  type: CLOSE_DEPLOY_MODAL,
});

export const setDeployStartTime = startTime => ({
  type: SET_DEPLOY_START_TIME,
  startTime,
});

export const setDeployEndTime = endTime => ({
  type: SET_DEPLOY_END_TIME,
  endTime,
});

export const addDeployPerson = id => ({
  type: ADD_DEPLOY_PERSON,
  id,
});

export const removeDeployPerson = id => ({
  type: REMOVE_DEPLOY_PERSON,
  id,
});

export const addDeployTag = id => ({
  type: ADD_DEPLOY_TAG,
  id,
});

export const removeDeployTag = id => ({
  type: REMOVE_DEPLOY_TAG,
  id,
});

// Time Segments

export const openTimeSegmentModal = (scheduleId, day, status, user, timeSegment) => ({
  type: OPEN_TIME_SEGMENTS_MODAL,
  scheduleId,
  day,
  status,
  user,
  timeSegment,
});

export const closeTimeSegmentModal = () => ({
  type: CLOSE_TIME_SEGMENTS_MODAL,
});

export const setModalTimeSegment = (status, startTime, endTime, note) => ({
  type: SET_MODAL_TIME_SEGMENT,
  status,
  startTime,
  endTime,
  note,
});
