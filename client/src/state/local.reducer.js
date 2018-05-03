// This is meant for config that is local to this device and is kept regardless
// of which user is logged in/logged out.

import { REHYDRATE } from 'redux-persist';

import { uuidv4 } from '../utils';

import { SET_DEBUG } from './constants';


const initialState = {
  loading: true,
  bugReport: 0,
};

const local = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      // convert persisted data to Immutable and confirm rehydration
      const currentState = action.payload && action.payload.auth ? action.payload.auth : state;
      const newState = {};
      if (!currentState.deviceUuid) {
        const deviceUuid = uuidv4();
        console.log(`Generated new device UUID ${deviceUuid}`);
        newState.deviceUuid = deviceUuid;
      }
      newState.loading = false;
      return Object.assign({}, currentState, newState);
    }
    case SET_DEBUG: {
      // 0 - unknown
      // 1 - dont report bugs
      // 2 - report bugs
      // 3 - report bugs with user idenfitication
      return Object.assign({}, state, { bugReport: action.bugReport });
    }
    default:
      return state;
  }
};

export default local;
