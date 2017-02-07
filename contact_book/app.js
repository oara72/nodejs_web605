// Run in strict mode
'use strict';

// Bring in the neccessary libraries
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const models = require('./models');

// Create an instance of express
const app = express();
// Create a NodeJS server with our app instance
const server = http.createServer(app);

// Prints out requests
app.use(morgan('dev'));
// Parses incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Require Routes
const v1Contacts = require('./routes/api/v1/contacts');

// Define Routes
app.use('/api/v1/contacts', v1Contacts);
// Setup a handler for any routes that aren't caught
app.use((req, res) => {
    res.status(404);
    res.json({
        statusCode: 404,
        message: 'Route not found'
    });
});

    // Sync our sequelize models before starting our server, setting force to false prevents sequelize from emptying our database everytime our app restarts
    models.sequelize.sync({ force: false }).then(() => {
        server.listen(3001, () => {
            var address = server.address();

            console.log(`Server listening on port ${ address.port }. Go to http://localhost:${ address.port }/`);
        });

        server.on('error', (err) => {
            console.log(err);
        });
    });

// // Set our server to listen on port 3001
// server.listen(3001, () => {
//     var address = server.address();

//     console.log(`Server listening on port ${ address.port }. Go to http://localhost:${ address.port }/`);
// });

// // Setup an error handler for our server
// server.on('error', (err) => {
//     console.log(err);
// });