import React from 'react';

import * as ReactDOMClient from 'react-dom/client';

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { rootReducer, rootSaga } from './Reducer';

import Popup from './Popup';
import './index.css';

const container = document.querySelector('#app-container');
const root = ReactDOMClient.createRoot(container);

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk, sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

root.render(
  <Provider store={store}>
    <Popup />
  </Provider>
  //   window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
