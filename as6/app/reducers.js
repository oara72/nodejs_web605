import { combineReducers } from 'redux';

import contactsReducer from './components/contacts/reducer';
import contactReducer from './components/contacts/contact/reducer';
import detailsReducer from './components/details/reducer';

const reducers = combineReducers({
    contactsReducer,
    contactReducer,
    detailsReducer
});

export default reducers;