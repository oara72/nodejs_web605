import { combineReducers } from 'redux';

// Import the reducers for all the components
import contactsReducer from './components/contacts/reducer';
import contactReducer from './components/contacts/contact/reducer';
import detailsReducer from './components/details/reducer';
import messagesReducer from './components/messages/reducer';
import updateReducer from './components/update/reducer';
import socketReducer from './reducers/socket.reducer';

// Call combineReducers method, pass all of our reducers into this method in order to create a single reducer
const reducers = combineReducers({
    socketReducer,
    contactsReducer,
    contactReducer,
    detailsReducer,
    messagesReducer,
    updateReducer
});

export default reducers;