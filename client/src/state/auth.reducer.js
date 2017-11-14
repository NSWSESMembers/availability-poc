import { REHYDRATE } from 'redux-persist/constants';
import Immutable from 'seamless-immutable';

import { LOGOUT, SET_CURRENT_USER } from './constants';
import { uuidv4 } from '../utils';

const initialState = Immutable({
  loading: true,
});

const auth = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      // convert persisted data to Immutable and confirm rehydration
      const currentState = action.payload.auth || state;
      return Immutable(currentState).merge({ loading: false });
    case SET_CURRENT_USER:
      return state.merge(action.user);
    case LOGOUT:
      return Immutable({ loading: false });
    default:
      return state;
  }
};

export default auth;
