import { combineReducers } from 'redux';

// Import the reducers for all the components
import contactsReducer from './components/contacts/reducer';
import contactReducer from './components/contacts/contact/reducer';
import detailsReducer from './components/details/reducer';
import messagesReducer from './components/messages/reducer';

// Call combineReducers method, pass all of our reducers into this method in order to create a single reducer
const reducers = combineReducers({
    contactsReducer,
    contactReducer,
    detailsReducer,
    messagesReducer
});

export default reducers;