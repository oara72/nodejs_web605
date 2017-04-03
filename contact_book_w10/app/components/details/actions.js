'use strict';

import axios from 'axios';

import { getContacts } from '../contacts/actions';

const deleteContact = (contactId) => {
    return (dispatch) => {
        dispatch(deleteContactStart);

        axios.delete(`http://localhost:3001/api/v1/contacts/${ contactId }/`).then((response) => {
            dispatch(deleteContactDone(response.data.contact));
            dispatch(getContacts());
        }).catch((error) => {
            dispatch(getContactError({
                error: error.response.data.message
            }));
        });
    };
};


const deleteContactStart = () => {
    return {
        type: 'CONTACT_DELETE_START'
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