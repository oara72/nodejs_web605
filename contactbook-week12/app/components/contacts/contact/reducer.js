'use strict';

const defaultState = {
    contact: {}
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_CONTACT_DONE': {
            return {
                contact: {
                    id: action.payload.contact.id
                }
            };
        }
        default: {
            return state;
        }
    }
}

export default reducer;