'use strict';

const express = require('express');
const router = express.Router();
const async = require('async');
const models = require('../../../models');
const authUtils = require('../../../utils/auth');

/**
 * Get all the contacts
 * GET /api/v1/contacts/
 */
router.get('/', authUtils.jwtAuth, (req, res) => {
    let responseData = {};

    models.contact.findAll({
        order: [
            ['id', 'ASC']
        ]
    }).then((data) => {
        responseData.status = 200;
        responseData.message = 'Contacts retrieved successfully!';
        responseData.contacts = data;

        res.status(responseData.status);
        res.json(responseData);
    }).catch((err) => {
        console.log(new Date());
        console.log(err);

        responseData.status = 500,
        responseData.message = 'Error getting Contacts.';

        res.status(responseData.status);
        res.json(responseData);
    });
});

/**
 * Get a contact
 * GET /api/v1/contacts/:contactId/
 */
router.get('/:contactId/', authUtils.jwtAuth, (req, res) => {
    let responseData = {};
    let contact;

    async.series([
        // Get the contact, and store it in the contact variable
        (callback) => {
            models.contact.findById(req.params.contactId).then((data) => {
                if (!data) {
                    responseData.status = 404;
                    responseData.message = 'Contact not found';

                    return callback(new Error(responseData.message));
                }

                contact = data.get({ plain: true });
                return callback();
            }).catch((err) => {
                responseData.status = 500,
                responseData.message = 'Error getting Contact.';

                return callback(err);
            });
        },

        // Verify that the ID of the user in req.decoded, and the user_id in the
        // contact match
        (callback) => {
            // Compare the IDs, if they're not equal return with an error
            if (req.decoded.id !== contact.user_id) {
                responseData.status = 403;
                responseData.message = 'You have insufficient permissions to access the Contact.';

                return callback(new Error(responseData.message));
            }

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
            responseData.message = 'Contact retrieved successfully!';
            responseData.contact = contact;

            res.status(responseData.status);
            res.json(responseData);
        }
    });
});

/**
 * Create a contact
 * POST /api/v1/contacts/
 */
router.post('/', authUtils.jwtAuth, (req, res) => {
    let responseData = {};

    async.series([
        // Verify that the ID of the user in req.decoded, and the user_id in the
        // request body match
        (callback) => {
            if (req.decoded.id !== req.body.contact.user_id) {
                responseData.status = 403;
                responseData.message = 'You have insufficient permissions to access the Contact.';

                return callback(new Error(responseData.message));
            }

            return callback();
        },

        // Create the Contact
        (callback) => {
            models.contact.create(req.body.contact).then((data) => {
                responseData.contact = data;

                return callback();
            }).catch((err) => {
                responseData.status = 500,
                responseData.message = 'Error creating Contact.';

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
            responseData.status = 201;
            responseData.message = 'Contact created successfully!';

            // Emit a socket event so that client apps know a new contact was
            // created
            req.io.emit('POST/api/v1/contacts/');

            res.status(responseData.status);
            res.json(responseData);
        }
    });
});

/**
 * Update a contact
 * PUT /api/v1/contacts/:contactId/
 */
router.put('/:contactId/', authUtils.jwtAuth, (req, res) => {
    let responseData = {};
    let contact;

    async.series([
        // Get the contact
        (callback) => {
            models.contact.findById(req.params.contactId).then((data) => {
                if (data) {
                    contact = data;
                    return callback();
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

        // Verify that the ID of the user in req.decoded, and the user_id in the
        // contact match
        (callback) => {
            // Compare the IDs, if they're not equal return with an error
            if (req.decoded.id !== contact.user_id) {
                responseData.status = 403;
                responseData.message = 'You have insufficient permissions to access the Contact.';

                return callback(new Error(responseData.message));
            }

            return callback();
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
    ], (err) => {
        if (err) {
            console.log(new Date());
            console.log(err);

            res.status(responseData.status);
            res.json(responseData);
        } else {
            responseData.status = 200;
            responseData.message = 'Contact updated successfully!';

            // Emit a socket event so that client apps know a contact was updated
            req.io.emit('PUT/api/v1/contacts/:contactId/');

            res.status(responseData.status);
            res.json(responseData);
        }
    });
});

/**
 * Delete a contact
 * DELETE /api/v1/contacts/:contactId/
 */
router.delete('/:contactId/', authUtils.jwtAuth, (req, res) => {
    let responseData = {};
    let contact;

    async.series([
        // Get the contact
        (callback) => {
            models.contact.findById(req.params.contactId).then((data) => {
                if (data) {
                    contact = data;
                    return callback();
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

        // Verify that the ID of the user in req.decoded, and the user_id in the
        // contact match
        (callback) => {
            // Compare the IDs, if they're not equal return with an error
            if (req.decoded.id !== contact.user_id) {
                responseData.status = 403;
                responseData.message = 'You have insufficient permissions to access the Contact.';

                return callback(new Error(responseData.message));
            }

            return callback();
        },

        // Delete the contact
        (callback) => {
            models.contact.destroy({
                where: {
                    id: req.params.contactId
                }
            }).then(() => {
                return callback();
            }).catch((err) => {
                responseData.status = 500,
                responseData.message = 'Error deleting Contact.';

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
            responseData.message = 'Contact deleted successfully!';

            // Emit a socket event so that client apps know a contact was deleted
            req.io.emit('DELETED/api/v1/contacts/:contactId/');

            res.status(responseData.status);
            res.json(responseData);
        }
    });
});

module.exports = router;