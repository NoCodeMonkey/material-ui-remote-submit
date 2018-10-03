import { combineReducers, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';

declare var window: Window & { devToolsExtension: any };

const reducer = combineReducers({
  form: formReducer
});

const store = (window.devToolsExtension
  ? window.devToolsExtension()(createStore)
  : createStore)(reducer);

export default store;