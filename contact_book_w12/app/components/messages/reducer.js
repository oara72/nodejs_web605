'use strict';

const defaultState = {
    success: '',
    info: '',
    warning: '',
    error: ''
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'CONTACTS_GET_ERROR': {
            return {
                ...state,
                error: action.payload.error
            };
        }
        default: {
            return state;
        }
    }
}

export default reducer;