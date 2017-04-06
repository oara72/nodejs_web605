'use strict';

const defaultState = {
    contact: {}
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        // Since we want to update the state on the "SET_CONTACT" action, will
        // add a case to the switch to update the state on it
        //
        // ...state will update the state to the value of the current state,
        // from there we can update the individual properties. This must be done
        // since we must return an entirely new state every time
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