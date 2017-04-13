'use strict';

const defaultState = {
    socket: require('socket.io-client')('http://localhost:3001')
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        default: {
            return state;
        }
    }
}

export default reducer;