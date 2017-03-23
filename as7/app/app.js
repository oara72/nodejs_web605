'use strict';

// Include any necessary libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

// Include root component
import Index from './components/index';

// Import main reducer
import reducers from './reducers';

// Take our reducers and run it through the createStore method, this is what we
// will pass to the root component of our app
// Also we can pass in middleware to our app, we are using the redux-logger
// middleware to keep track of what actions are taking place in our app
// Thunk allows us to dispatch multiple actions, this is useful for letting
// users know what is happening on async requests 
let store = createStore(reducers, applyMiddleware(createLogger(), thunk));

// Render our root component to the provided element
ReactDOM.render(
// Wrap our application in the prodiver component, passing the store we created
// to it. This will expose the store to all of our components
<Provider store={ store }>
    <Index/>
</Provider>, document.getElementById('app'));