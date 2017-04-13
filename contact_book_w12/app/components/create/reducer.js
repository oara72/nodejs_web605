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
            case 'CONTACT_CREATE_CONTACTNAME': {
                return {
                    ...state,
                    contact: {
                        ...state.contact,
                        contactname: action.payload.contact.contactname
                    }
                };
            }
            case 'CONTACT_CREATE_SUPERPOWER': {
                return {
                    ...state,
                    contact: {
                        ...state.contact,
                        superpower: action.payload.contact.superpower
                    }
                };
            }
            default: {
                return state;
            }
        }
    }

    export default reducer;