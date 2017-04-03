'use strict';

const defaultState = {
    contact: {}
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_CONTACT': {
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