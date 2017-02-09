'use strict';

const socket = require('socket.io-client')('http://localhost:3001');

socket.on('connect', ()=> {
    console.log('Socket:connect');
});

socket.on('POST/api/v1/contacts/', (data) => {
    console.log('Socket:POST/api/v1/contacts/', data);
});

socket.on('PUT/api/v1/contacts/:contactId/', (data) => {
    console.log('Socket:PUT/api/v1/contacts/:contactId/', data);
});

socket.on('DELETED/api/v1/contacts/:contactId/', (data) => {
    console.log('Socket:DELETED/api/v1/contacts/:contactId/', data);
});


