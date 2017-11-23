// This is meant for config that is local to this device and is kept regardless
// of which user is logged in/logged out.

import { REHYDRATE } from 'redux-persist/constants';
import Immutable from 'seamless-immutable';

import { LOGOUT, SET_CURRENT_USER } from './constants';
import { uuidv4 } from '../utils';

const initialState = Immutable({
  loading: true,
});

const local = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      // convert persisted data to Immutable and confirm rehydration
      const currentState = action.payload.auth || state;
      const newState = {};
      if(!currentState.deviceUuid) {
        const deviceUuid = uuidv4();
        console.log(`Generated new device UUID ${deviceUuid}`);
        newState.deviceUuid = deviceUuid;
      }
      newState.loading = false;
      return Immutable(currentState).merge(newState);
    default:
      return state;
  }
};

export default local;
