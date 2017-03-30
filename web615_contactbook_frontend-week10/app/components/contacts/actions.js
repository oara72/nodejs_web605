'use strict';

import axios from 'axios';

// Import action from a different file
import { setContact } from './contact/actions';

/**
 * Since this action will be async we will have to dispatch multiple actions to
 * let the user know what is happening. This functionality is given us to
 * redux-thunk
 */
const getContacts = () => {
    return (dispatch) => {
        dispatch(getContactsStart);

        axios.get('http://localhost:3001/api/v1/contacts/').then((response) => {
            dispatch(getContactsDone({
                contacts: response.data.contacts
            }));

            if (response.data.contacts && response.data.contacts.length) {
                dispatch(setContact({
                    contact: response.data.contacts[0]
                }));
            }
        }).catch((error) => {
            dispatch(getContactsError({
                error: error.response.data.message
            }));
        });
    };
};

/**
 * Emits the CONTACTS_GET_START event, this would be useful if we wanted to show
 * a loading animation
 */
const getContactsStart = () => {
    return {
        type: 'CONTACTS_GET_START'
    };
};

/**
 * Emits the CONTACTS_GET_DONE event, any reducers that need data from this call
 * would listen for this event
 * @param {Object} payload - Response from the API call
 */
const getContactsDone = (payload) => {
    return {
        type: 'CONTACTS_GET_DONE',
        payload
    };
};

/**
 * Emits the CONTACTS_GET_ERROR event, our global messages component will listen
 * for this event
 * @param {Object} payload - Reponse from API call
 */
const getContactsError = (payload) => {
    return {
        type: 'CONTACTS_GET_ERROR',
        payload
    };
};

export {
    getContacts
};