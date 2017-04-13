'use strict';

    import axios from 'axios';

    const getContacts = () => {
        return (dispatch) => {
            dispatch(getContactsStart);

            axios.get('http://localhost:3001/api/v1/contacts/').then((response) => {
                dispatch(getContactsDone({
                    contacts: response.data.contacts
                }));
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
    * @param {Object} payload - Response from the API call
    */
    const getContactsDone = (payload) => {
        return {
            type: 'CONTACTS_GET_DONE',
            payload
        };
    };

    /**

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