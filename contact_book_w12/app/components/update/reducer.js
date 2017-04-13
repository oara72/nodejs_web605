'use strict';

    const defaultState = {
        contact: {}
    };

    const reducer = (state = defaultState, action) => {
        switch (action.type) {
            case 'GET_CONTACT_DONE': {
                return {
                    ...state,
                    contact: action.payload.contact
                };
            }
            case 'CONTACT_UPDATE_NAME': {
                return {
                    ...state,
                    contact: {
                        ...state.contact,
                        name: action.payload.contact.name
                    }
                };
            }
            case 'CONTACT_UPDATE_CONTACTNAME': {
                return {
                    ...state,
                    contact: {
                        ...state.contact,
                        contactname: action.payload.contact.contactname
                    }
                };
            }
            case 'CONTACT_UPDATE_SUPERPOWER': {
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