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

        default: {
            return state;
        }
    }
}

export default reducer;