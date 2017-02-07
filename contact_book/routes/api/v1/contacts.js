'use strict';

const async = require('async');

const express = require('express');
const router = express.Router();
// Since we are now using sequelize to querying our database we must now include models
const models = require('../../../models');

router.get('/', (req, res) => {
    // I almost always create a responseData object to store the data I'll be returning from the endpoint
    let responseData = {};

    // All sequelize queries follow a similar pattern, first the model to query, then the query type
    models.contact.findAll({
        order: [
            ['id', 'ASC']
        ]
    // A successful query is handled in the "then" portion of the promise
    }).then((data) => {
        // We'll some values to the responseData object
        responseData.status = 200;
        responseData.message = 'Contacts retrieved successfully!';
        responseData.contacts = data;

        // Return with a appropriate status code
        res.status(responseData.status);
        // And return with the JSON
        res.json(responseData);
    // Errors from querying are handled in the "catch" portion of the promise
    }).catch((err) => {
        console.log(new Date());
        console.log(err);

        responseData.status = 500,
        responseData.message = 'Error getting Contacts.';

        res.status(responseData.status);
        res.json(responseData);
    });
});

router.post('/', (req, res) => {
    let responseData = {};

    models.contact.create(req.body.contact).then((data) => {
        responseData.status = 201,
        responseData.message = 'Contact created successfully!';
        responseData.contact = data;

        res.status(responseData.status);
        res.json(responseData);
    }).catch((err) => {
        console.log(new Date());
        console.log(err);

        responseData.status = 500,
        responseData.message = 'Error creating Contact.';

        res.status(responseData.status);
        res.json(responseData);
    });
});

// We can define paramaters in our request with ":param", these become accessible via req.params
    router.get('/:contactId/', (req, res) => {
        let responseData = {};

        models.contact.findById(req.params.contactId).then((data) => {
            responseData.status = 200;
            responseData.message = 'Contact retrieved successfully!';
            responseData.contact = data;

            res.status(responseData.status);
            res.json(responseData);
        }).catch((err) => {
            console.log(new Date());
            console.log(err);

            responseData.status = 500,
            responseData.message = 'Error getting Contact.';

            res.status(responseData.status);
            res.json(responseData);
        });
    });

// We can define paramaters in our request with ":param", these become accessible via req.params
    router.get('/:contactId/', (req, res) => {
        let responseData = {};

        models.contact.findById(req.params.contactId).then((data) => {
            responseData.status = 200;
            responseData.message = 'Contact retrieved successfully!';
            responseData.contact = data;

            res.status(responseData.status);
            res.json(responseData);
        }).catch((err) => {
            console.log(new Date());
            console.log(err);

            responseData.status = 500,
            responseData.message = 'Error getting Contact.';

            res.status(responseData.status);
            res.json(responseData);
        });
    });

router.put('/:contactId/', (req, res) => {
        let responseData = {};
        let contact;

        // Since we are doing multiple queries, we'll control the flow using the async library
        async.series([
            // Get the contact
            (callback) => {
                models.contact.findById(req.params.contactId).then((data) => {
                    // Ensure that the contact exists
                    if (data) {
                        // Set the returned data to the contact variable so it can be accessed by the next method in the series
                        contact = data;
                        return callback();
                    // If the contact doesn't exist return with a 404
                    } else {
                        responseData.status = 404,
                        responseData.message = 'Contact not found.';
                        return callback(new Error(responseData.message));
                    }
                }).catch((err) => {
                    responseData.status = 500,
                    responseData.message = 'Error getting Contact.';

                    return callback(err);
                });
            },

            // Update and save the contact
            (callback) => {
                contact.name = req.body.contact.name;
                contact.email = req.body.contact.email;
                contact.phone_number = req.body.contact.phone_number;

                contact.save().then((data) => {
                    responseData.contact = data;

                    return callback();
                }).catch((err) => {
                    responseData.status = 500,
                    responseData.message = 'Error updating Contact.';

                    return callback(err);
                });
            }
        // The final callback is where you check for errors handle the final response,
        ], (err) => {
            if (err) {
                console.log(new Date());
                console.log(err);

                res.status(responseData.status);
                res.json(responseData);
            } else {
                responseData.status = 200;
                responseData.message = 'Contact updated successfully!';

                res.status(responseData.status);
                res.json(responseData);
            }
        });
    });

router.delete('/:contactId/', (req, res) => {
        let responseData = {};

        models.contact.destroy({
            where: {
                id: req.params.contactId
            }
        }).then(() => {
            responseData.status = 200,
            responseData.message = 'Contact deleted successfully!';

            res.status(responseData.status);
            res.json(responseData);
        }).catch((err) => {
            console.log(new Date());
            console.log(err);

            responseData.status = 500,
            responseData.message = 'Error deleting Contact.';

            res.status(responseData.status);
            res.json(responseData);
        });
    });

module.exports = router;

// 'use strict';

// const express = require('express');
// // Create an instance of express router
// const router = express.Router();

// // We'll define all endpoints under router, followed by the request type, the endpoint path, then the request and response object
// router.get('/', (req, res) => {
//     res.json('Hello');
// });

// // We must always export the router object in order to make it accessible when requiring it in our app.js file
// module.exports = router;