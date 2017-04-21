import {
  createLogger
} from 'redux-logger'
import appReducer from 'reducers/app';

const redux = require('redux');
const thunk = require("redux-thunk").default;
const env = process.env.NODE_ENV || 'development';

function isFunction(object) {
  return typeof object === 'function';
}

function isNotFunction(object) {
  return !isFunction(object);
}

const reducers = redux.combineReducers({
  app: appReducer,
});

var middleware = [thunk]

if (env === 'development') {
  const logger = createLogger({
    collapsed: true
  });
  middleware.push(logger)
}

const createStoreWithMiddleware = redux.compose(
  redux.applyMiddleware(...middleware)
)(redux.createStore);

const reduxStore = createStoreWithMiddleware(reducers);

export default reduxStore;

