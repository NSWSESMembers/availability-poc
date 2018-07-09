import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import authReducer from '../reducers/auth';
import scheduleReducer from '../reducers/schedule';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'primary',
  storage,
  version: 1,
  blacklist: ['schedule'],
};

export default () => {
  const store = createStore(
    persistCombineReducers(persistConfig, {
      auth: authReducer,
      schedule: scheduleReducer,
    }),
    {},
    composeEnhancers(applyMiddleware(thunk)),
  );
  const persistor = persistStore(store);

  return { store, persistor };
};
