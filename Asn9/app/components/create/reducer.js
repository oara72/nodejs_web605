'use strict';

    const defaultState = {
        contact: {}
    };

    const reducer = (state = defaultState, action) => {
        switch (action.type) {
            case 'GET_CREATE_DONE': {
                return {
                    ...state,
                    contact: action.payload.contact
                };
            }
            case 'CONTACT_CREATE_NAME': {
                return {
                    ...state,
                    contact: {
                        ...state.contact,
                        name: action.payload.contact.name
                    }
                };
            }
            case 'CONTACT_CREATE_EMAIL': {
                return {
                    ...state,
                    contact: {
                        ...state.contact,
                        email: action.payload.contact.email
                    }
                };
            }
            case 'CONTACT_CREATE_PHONE_NUMBER': {
                return {
                    ...state,
                    contact: {
                        ...state.contact,
                        phone_number: action.payload.contact.phone_number
                    }
                };
            }
            default: {
                return state;
            }
        }
    }

    export default reducer;