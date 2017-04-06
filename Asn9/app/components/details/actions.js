'use strict';

import axios from 'axios';

import { getContact } from '../../actions/contact.actions';


const deleteContactStart = () => {
    return {
        type: 'CONTACT_CREATE_START'
    };
};

/**
* Emit done event
*/
const deleteContactDone = () => {
    return {
        type: 'CONTACT_DELETE_DONE'
    };
};

/**
* Emit error event
* @param {String} error - The error message from the backend
*/
const deleteContactError = (error) => {
    return {
        type: 'CONTACT_DELETE_ERROR',
        payload: {
            error
        }
    };
};

export {
    deleteContact
};