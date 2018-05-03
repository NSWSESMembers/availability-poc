import { REHYDRATE } from 'redux-persist';

import { LOGOUT, SET_CURRENT_USER } from './constants';

const initialState = {
  loading: true,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      // convert persisted data to Immutable and confirm rehydration
      const currentState = action.payload && action.payload.auth ? action.payload.auth : state;
      return Object.assign({}, currentState, { loading: false });
    }
    case SET_CURRENT_USER:
      return Object.assign({}, state, action.user);
    case LOGOUT:
      return { loading: false };
    default:
      return state;
  }
};

export default auth;
