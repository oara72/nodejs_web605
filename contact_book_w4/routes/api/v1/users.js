'use strict';

const express = require('express');
const router = express.Router();
const async = require('async');
const models = require('../../../models');
const jwt = require('jsonwebtoken');
const config = require(__dirname + '/../../../config/config.json');
const authUtils = require('../../../utils/auth');

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
router.get('/:userId/contacts/', authUtils.jwtAuth, (req, res) => {
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
        if (data.id !== req.decoded.id) {
            responseData.status = 403;
            responseData.message = 'You don\' have sufficient permissions to access this data';
        } else {
            responseData.status = 200;
            responseData.message = 'User retrieved successfully!';
            responseData.user = data;
        }

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
 * Login a user
 * POSt /api/v1/users/login/
 */
router.post('/login/', (req, res) => {
    let responseData = {};
    let user;

    async.series([
        // Get the user
        (callback) => {
            models.user.findOne({
                where: {
                    email: req.body.user.email
                }
            }).then((data) => {
                if (!data) {
                    responseData.status = 404;
                    responseData.message = 'User not found';

                    return callback(new Error(responseData.message));
                }

                // We'll use our verifyPassword instance method to make sure the
                // password supplied in the request matches the hashed password
                // stored in our database
                if (!data.verifyPassword(req.body.user.password, data.password)) {
                    responseData.status = 400;
                    responseData.message = 'Invalid credentials';

                    return callback(new Error(responseData.message));
                }
                
                // This will return our user object as a plain JS object, no
                // sequelize features added
                user = data.get({ plain: true });
                // Since we don't want to store the hash in our JWT, we'll first
                // delete it
                delete user.password;

                return callback();
            }).catch((err) => {
                responseData.status = 500,
                responseData.message = 'Error logging in User.';

                return callback(err);
            });
        },

        // Create the JWT
        (callback) => {
            // This create a token with the user object as the payload
            // it uses the secret in our config to encrypt
            // and it sets the token to expire in 24hrs
            const token = jwt.sign(user, config.development.jwt_secret, {
                expiresIn: 86400 // 24 hours
            });

            // We'll save the created token in our responseData to be sent back
            // to the client
            responseData.token = token;

            return callback();
        }
    ], (err) => {
        if (err) {
            console.log(new Date());
            console.log(err);

            res.status(responseData.status);
            res.json(responseData);
        } else {
            responseData.status = 200;
            responseData.message = 'Login successful!';

            res.status(responseData.status);
            res.json(responseData);
        }
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
            if (req.body.user.password) {
                user.password = user.hashPassword(req.body.user.password);
            }

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