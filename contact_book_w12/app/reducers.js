import { combineReducers } from 'redux';

import contactsReducer from './components/contacts/reducer';
import contactReducer from './components/contacts/contact/reducer';
import detailsReducer from './components/details/reducer';
import messagesReducer from './components/messages/reducer';
import updateReducer from './components/update/reducer';
import createReducer from './components/create/reducer';
import socketReducer from './reducers/socket.reducer';

const reducers = combineReducers({
    socketReducer,
    contactsReducer,
    contactReducer,
    detailsReducer,
    messagesReducer,
    updateReducer,
    createReducer
});

export default reducers;