import { SET_DEBUG } from '../state/constants';

const setDebugState = bugReport => ({
  type: SET_DEBUG,
  bugReport,
});

export default setDebugState;
