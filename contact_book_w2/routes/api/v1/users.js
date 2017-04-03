'use strict';

const express = require('express');
const router = express.Router();
const async = require('async');
const models = require('../../../models');

/**
 * Get all the users
 * GET /api/v1/users/
 */
router.get('/', (req, res) => {
    let responseData = {};

    models.user.findAll({
        attributes: {
            exclude: ['password']
        },
        order: [
            ['id', 'ASC']
        ]
    }).then((data) => {
        responseData.status = 200;
        responseData.message = 'Users retrieved successfully!';
        responseData.users = data;

        res.status(responseData.status);
        res.json(responseData);
    }).catch((err) => {
        console.log(new Date());
        console.log(err);

        responseData.status = 500,
        responseData.message = 'Users getting Contacts.';

        res.status(responseData.status);
        res.json(responseData);
    });
});

/**
 * Get a user with all of its contacts
 * GET /api/v1/users/:userId/contacts/
 */
router.get('/:userId/contacts/', (req, res) => {
    let responseData = {};

    // Find the user by its ID
    models.user.findById(req.params.userId, {
        // Exclude the password column (good practice, reduces exposure of
        // passwords to the world)
        attributes: {
            exclude: ['password']
        },
        // Include our contact model here
        // You can include multiple models, and define other query commands such
        // as where clauses, attribute selection, ordering, etc
        include: [{
            model: models.contact
        }]
    }).then((data) => {
        responseData.status = 200;
        responseData.message = 'User retrieved successfully!';
        responseData.user = data;

        res.status(responseData.status);
        res.json(responseData);
    }).catch((err) => {
        console.log(new Date());
        console.log(err);

        responseData.status = 500,
        responseData.message = 'Error getting User.';

        res.status(responseData.status);
        res.json(responseData);
    });
});

/**
 * Create a user
 * POST /api/v1/users/
 */
router.post('/', (req, res) => {
    let responseData = {};

    models.user.create(req.body.user).then((data) => {
        responseData.status = 201,
        responseData.message = 'User created successfully!';
        responseData.user = data;

        res.status(responseData.status);
        res.json(responseData);
    }).catch((err) => {
        console.log(new Date());
        console.log(err);

        responseData.status = 500,
        responseData.message = 'Error creating User.';

        res.status(responseData.status);
        res.json(responseData);
    });
});

/**
 * Update a user
 * PUT /api/v1/users/:userId/
 */
router.put('/:userId/', (req, res) => {
    let responseData = {};
    let user;

    async.series([
        // Get the user
        (callback) => {
            models.user.findById(req.params.userId).then((data) => {
                if (data) {
                    user = data;
                    return callback();
                } else {
                    responseData.status = 404,
                    responseData.message = 'User not found.';
                    return callback(new Error(responseData.message));
                }
            }).catch((err) => {
                responseData.status = 500,
                responseData.message = 'Error getting User.';

                return callback(err);
            });
        },

        // Update and save the user
        (callback) => {
            user.name = req.body.user.name;
            user.email = req.body.user.email;
            user.password = req.body.user.password;

            user.save().then((data) => {
                responseData.user = data;

				return callback();
			}).catch((err) => {
                responseData.status = 500,
                responseData.message = 'Error updating User.';

                return callback(err);
			});
        }
    ], (err) => {
        if (err) {
            console.log(new Date());
            console.log(err);

            res.status(responseData.status);
            res.json(responseData);
        } else {
            responseData.status = 200;
            responseData.message = 'User updated successfully!';

            res.status(responseData.status);
            res.json(responseData);
        }
    });
});

/**
 * Delete a user
 * DELETE /api/v1/users/:userId/
 */
router.delete('/:userId/', (req, res) => {
    let responseData = {};

    models.user.destroy({
        where: {
            id: req.params.userId
        }
    }).then(() => {
        responseData.status = 200,
        responseData.message = 'User deleted successfully!';

        res.status(responseData.status);
        res.json(responseData);
    }).catch((err) => {
        console.log(new Date());
        console.log(err);

        responseData.status = 500,
        responseData.message = 'Error deleting User.';

        res.status(responseData.status);
        res.json(responseData);
    });
});

module.exports = router;
