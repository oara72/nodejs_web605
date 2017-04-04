'use strict';

const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const models = require('./models');

// Prints out requests
app.use(morgan('dev'));
// Parses incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// This middleware includes Socket.IO instance in the request object so that all
// of the endpoints have access to Socket.IO
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Require Routes
const v1Contacts = require('./routes/api/v1/contacts');
const v1Users = require('./routes/api/v1/users');

// Define Routes
app.use('/api/v1/contacts', v1Contacts);
app.use('/api/v1/users', v1Users);

app.use((req, res) => {
    res.status(404);
    res.json({
        statusCode: 404,
        message: 'Route not found'
    });
});

models.sequelize.sync({ force: false }).then(() => {
    server.listen(3001, () => {
        var address = server.address();

        console.log(`Server listening on port ${ address.port }. Go to http://localhost:${ address.port }/`);
    });

    server.on('error', (err) => {
        console.log(err);
    });
});