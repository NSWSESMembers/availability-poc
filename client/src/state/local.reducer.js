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
      if(!currentState.deviceId) {
        const uuid = uuidv4();
        console.log(`Generated new device UUID ${uuid}`);
        currentState.deviceId = uuid;
      }
      currentState.loading = false;
      return Immutable(currentState);
    default:
      return state;
  }
};

export default local;
