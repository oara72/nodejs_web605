'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import Index from './components/index';

import reducers from './reducers';
 
let store = createStore(reducers, applyMiddleware(createLogger(), thunk));

ReactDOM.render(

<Provider store={ store }>
    <Index/>
</Provider>, document.getElementById('app'));