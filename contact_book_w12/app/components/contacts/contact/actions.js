'use strict';

const setContact = (payload) => {
    return {
        type: 'SET_CONTACT',
        payload
    };
};

export {
    setContact
};