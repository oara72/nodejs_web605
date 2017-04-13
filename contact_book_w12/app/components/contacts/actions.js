'use strict';

import axios from 'axios';

import { setContact } from './contact/actions';

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


const getContactsStart = () => {
    return {
        type: 'CONTACTS_GET_START'
    };
};

/**
 * 
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
 *
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