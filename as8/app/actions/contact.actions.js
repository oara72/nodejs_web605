'use strict';

import axios from 'axios';

import { getContacts } from './contacts.actions';

/**
* Send request to backend to get the contact
* @param {Number|String} contactId - ID of the contact to get 
*/
const getContact = (contactId) => {
    return (dispatch) => {
        dispatch(getContactStart);

        axios.get(`http://localhost:3001/api/v1/contacts/${ contactId }/`).then((response) => {
            dispatch(getContactDone(response.data.contact));
        }).catch((error) => {
            dispatch(getContactError({
                error: error.response.data.message
            }));
        });
    };
};

/**
* Emit start event
*/
const getContactStart = () => {
    return {
        type: 'GET_CONTACT_START'
    };
};

/**
* Emit done event
* @param {Object} contact - The contact retrieved from the backend
*/
const getContactDone = (contact) => {
    return {
        type: 'GET_CONTACT_DONE',
        payload: {
            contact
        }
    };
};

/**
* Emit error event
* @param {String} error - The error message from the backend
*/
const getContactError = (error) => {
    return {
        type: 'GET_CONTACT_ERROR',
        payload: {
            error
        }
    };
};

/**
* Send request to API to update the contact
* @param {Object} contact - The contact to update
*/
const updateContact = (contact) => {
    return (dispatch) => {
        dispatch(updateContactStart());

        axios.put(`http://localhost:3001/api/v1/contacts/${ contact.id }/`, {
            contact
        }).then((response) => {
            dispatch(updateContactDone());
            dispatch(getContact(contact.id));
            dispatch(getContacts());
        }).catch((error) => {
            dispatch(updateContactError({
                error: error.response.data.message
            }));
        });
    };
};

/**
* Emit start event
*/
const updateContactStart = () => {
    return {
        type: 'CONTACT_UPDATE_START'
    };
};

/**
* Emit done event
*/
const updateContactDone = () => {
    return {
        type: 'CONTACT_UPDATE_DONE'
    };
};

/**
* Emit error event
* @param {String} error - The error message from the backend
*/
const updateContactError = (error) => {
    return {
        type: 'CONTACT_UPDATE_ERROR',
        payload: {
            error
        }
    };
};

export {
    getContact,
    updateContact
};