'use strict';

// Create some dummy data for our list, this will eventually be replaced with
// data from our API 
const defaultState = {
    contacts: []
};

/**
 * This sets the state of our component, it listen to events from actions. It
 * will listen to all events, so you must return a default which will maintain
 * the state
 * @param {Object} state - The state for our reducer, by default it will be
 *   whatever we've put in the default state object
 * @param {Object} action - The action dispatched, this will have to properties
 * @param {String} action.type - The type of action dispatch, think of it as the
 *   name of the action
 * @param {Object} payload - Values to update our state with
 */
const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'CONTACTS_GET_DONE': {
            return {
                ...state,
                contacts: action.payload.contacts
            };
        }
        default: {
            return state;
        }
    }
}

export default reducer;