# readme

# Authenticating API Requests #

*Note: File is best viewed in a editor with markdown preview turned on*

You'll want to grab a copy of the code as it stands from our last lesson. A copy of the code can be found at: https://github.com/ShawnCC/web615_contactbook_backend/tree/week2

Be sure to install all dependencies for the project before you go any further

* We'll start by hashing our the password property of the user model
    * We'll first need to install bcrypt which is the library we'll use to hash the passwords run ``` npm i bcrypt -S ``` to install it
    * Next we'll include the package in our user model file. Open up the file models/user.js and add the following to the top of the file after the 'use strict' statement
    ```
    const bcrypt = require('bcrypt');
    // Number of rounds the password is run through a hashing algorithm. The more rounds the more secure, but also the more time consuming
    const saltRounds = 10;
    ```
    * Now we'll create methods for our model in order to hash and verify the password. In the user model after the classMethods object add the following
    ```
    instanceMethods: {
        /**
        * Hashes a plaintext password
        * @param {String} password - The plaintext password to hash
        */
        hashPassword: (password) => {
            return bcrypt.hashSync(password, saltRounds);
        },

        /**
        * Verifys a plaintext password against that hash stored in the model
        * @param {String} password - The plaintext password to verify
        * @param {String} hash - The hashed password to verify against
        */
        verifyPassword: (password, hash) => {
            return bcrypt.compareSync(password, hash);
        }
    },
    ```
    * With that in place we'll add a hook to hash the password before it is created, this will prevent plaintext passwords from being stored in the database and will instead store our hashed password
    ```
    hooks: {
        beforeCreate: (instance) => {
            instance.password = bcrypt.hashSync(instance.password, saltRounds);
        }
    }
    ```
    * Will all that done, we should now be able to create a user using Postman and see a user returned with a hashed password. Ex.
    ```
    {
        "status": 201,
        "message": "User created successfully!",
        "user": {
            "id": 2,
            "name": "Shawn",
            "email": "email@test.com",
            "password": "$2a$10$u4TI1pf6gpgM4nk0UUDOue4S0j95WE5L/u1LWSyj5AAVSJdZB65l.",
            "updated_at": "2017-01-21T22:37:50.361Z",
            "created_at": "2017-01-21T22:37:50.361Z"
        }
    }
    ```
    * That will take care of hashing a password during the creation of a user, but we'll need to re-hash the password if a new password was sent to our API on a request to update a user. To do that we'll add the following code to /routes/users.js in the PUT endpoint where we are updating our model
    ```
    if (req.body.user.password) {
        user.password = user.hashPassword(req.body.user.password);
    }
    ```
    * Now if we send a PUT request to update our model, and we have provided a password in the request body, our API will rehash the password. If we do not send a password in the request body, our API will do nothing, and the original password will remain untouched

* With our user password now hashed, we'll create a login route, this route will return a JSON Web Token (JWT) in the response body, this token will be sent in the following requests and will be checked to see if the request is coming from a valid source
    * First install a JWT package using ``` npm i jsonwebtoken -S ``` this will be what we use to create our JWTs
    * Now in the file /routes/users.js we'll add a require statement for the JWT package we just installed 
    ```
    const jwt = require('jsonwebtoken');
    ```
    * Now we'll add a secret to our config, this will be used when creating and verifying our JWTs. In config/config.json add the following line after the storage property
    ```
    "jwt_secret": "E3F68BCDF3FF9D7A34FA7CBCE5EC4831F7F75ACB6A5B145894FEE5F619"
    ```
    * Now we'll create a endpoint to login a user, we'll place this after the POST request to create a user (I like to keep all the same types of requests together in a file), we'll add the following code for the login endpoint
    ```
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

                    // We'll use our verifyPassword instance method to make sure the password supplied in the request
                    // matches the hashed password stored in our database
                    if (!data.verifyPassword(req.body.user.password, data.password)) {
                        responseData.status = 400;
                        responseData.message = 'Invalid credentials';

                        return callback(new Error(responseData.message));
                    }
                    
                    // This will return our user object as a plain JS object, no sequelize features added
                    user = data.get({ plain: true });
                    // Since we don't want to store the hash in our JWT, we'll first delete it
                    delete user.password;

                    return callback();
                }).catch((err) => {
                    console.log(new Date());
                    console.log(err);

                    responseData.status = 500,
                    responseData.message = 'Error logging in User.';

                    res.status(responseData.status);
                    res.json(responseData);
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

                // We'll save the created token in our responseData to be sent back to the client
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
    ```
    * We should now be able to make a POST request to /api/v1/users/login/ and see a JWT in our response. In the request body you'll only need the user's email and password, so it should look something like:
    ```
    {
        "user": {
            "email": "email@test.com",
            "password": "password12"
        }
    }
    ```
    * And if successful we'll get a response like:
    ```
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IlNoYXduIiwiZW1haWwiOiJlbWFpbEB0ZXN0LmNvbSIsImNyZWF0ZWRfYXQiOiIyMDE3LTAxLTIxVDIyOjM3OjUwLjM2MVoiLCJ1cGRhdGVkX2F0IjoiMjAxNy0wMS0yMVQyMjo1NDowNS4wMzdaIiwiaWF0IjoxNDg1MDQxNDk4LCJleHAiOjE0ODUxMjc4OTh9.gFCatU8H_LWf8qF1QnnFRGWAF21O-UA7IOVhxbtojFE",
        "status": 200,
        "message": "Login successful!"
    }
    ```
    * Be sure to save the token from your response, we'll be using this to authenticate requests in the upcoming code

* We'll now create some middleware to authenticate incoming requests on our endpoints to make sure they're being sent by users of our application
    * We'll install another library called "q", this will allow us to create our own promises, install the library using ``` npm i q -S ```
    * Now we'll create a directory in the root of our project called "utils"
    * In the newly created utils directory create a file called "auth.js"
    * In the file auth.js we'll create our authentication middleware and its accompanying functions. Add the following code
    ```
    'use strict';

    const q = require('q');
    const jwt = require('jsonwebtoken');
    const models = require('../models');
    const config = require(__dirname + '/../config/config.json');

    /**
    * Middleware to validate the JWT sent in the request
    * @param {Object} req - The request object
    * @param {Object} res - The response object
    * @param {Object} next - This callback allows use to continue on to the main
    *   function of our endpoint
    */
    const jwtAuth = (req, res, next) => {
        const token = req.headers.authorization;

        // Run our validate JWT function
        validateJwt(token).then((data) => {
            // If all went well, store the user in the request object for later use
            req.decoded = data;
            next();
        }, function (err) {
            console.log(new Date());
            console.log(err);

            let responseData = {};
            responseData.error_type = 'authentication_error';
            responseData.status_code = 401;
            responseData.message = 'You must provide valid credentials';

            res.status(responseData.status_code).json(responseData);
        });
    };

    /**
    * Validates our JWT, if it is valid it will return whatever is decoded, in our
    * case it should be a user object, we'll then take that user object and query
    * the database to ensure that a user with that data actually exists
    */
    const validateJwt = (token) => {
        const deferred = q.defer();

        // Make sure a token was supplied
        if (token) {
            // Verify our JWT using our JWT secret
            jwt.verify(token, config.development.jwt_secret, (err, decoded) => {
                // Handle any errors
                if (err) {
                    deferred.reject(err);
                }

                // Check the user in the JWT against the user in the database
                getUserById(decoded).then((data) => {
                    deferred.resolve(data);
                }, (err) => {
                    deferred.reject(err);
                });
            });
        } else {
            deferred.reject(new Error('No token provided'));
        }

        return deferred.promise;
    };

    /**
    * This will take a user object and query for it in the database to make sure it
    * is a existing user
    * @param {Object} decoded - The user object stored in the JWT
    */
    const getUserById = (decoded) => {
        const deferred = q.defer();

        if (!decoded || !decoded.id) {
            deferred.reject(new Error('No ID provided'));
        } else {
            models.user.findById(decoded.id).then((data) => {
                // Make sure user exists
                if (!data) {
                    deferred.reject(new Error('No user found'));
                }

                // Validate the user properties from the database user against the
                // user in the token. If the properties don't match it means the
                // user has since changed, and our token should no longer be
                // considered valid
                if (data.name !== data.name) {
                    deferred.reject(new Error('Token invalid'));
                }

                if (data.email !== decoded.email) {
                    deferred.reject(new Error('Token invalid'));
                }

                // If everything checks out, resolve our promise and return our user
                deferred.resolve(data.get({plain: true}));
            }).catch((err) => {
                deferred.reject(err);
            });
        }

        return deferred.promise;
    };

    // We'll only expore the jwtAuth function for now, but any code functions we
    // want to expose could be added to this object
    module.exports = {
        jwtAuth
    };
    ```
    * With all that code in place, we can now use it to authenticate incoming requests on our endpoints
    * Open up the file /routes/api/v1/contacts.js, in this file after the existing require statements add the following ``` const authUtils = require('../../../utils/auth'); ```
        * This will allow us to use our newly created authentication middleware
    * Now in our get all endpoint we'll add ``` authUtils.jwtAuth ``` after the string that declares the endpoint path and before our callback, the first line of the endpoint would now look like
    ```
    router.get('/', authUtils.jwtAuth, (req, res) => {
    ```
    * If we were to now make a request to the /api/v1/contacts/ endpoint we'd see this response
    ```
    {
        "error_type": "authentication_error",
        "status_code": 401,
        "message": "You must provide valid credentials"
    }
    ```
    * To get around this authenticate we'll add our JWT to our request
        * In Postman in the "Headers" tab add "Authorization" as the key and your previously saved JWT from the login response as the value, if you try the /api/v1/contacts/ request again, we should get a valid response with our contacts
        * More info on Postman can be found on Blackboard under Content/Week 1/Postman Info
    
* With our authorization working, we'll add it to the rest of the endpoints in routes/api/v1/contacts.js
    * Following the same steps as the previously secured endpoint add ``` authUtils.jwtAuth ``` to the endpoints

* Now all of our endpoints for contacts need valid JWT in the requests in order to be successful. However we'll secure our endpoints further by ensuring that a user can only manipulate an endpoint of a contact that belongs to them

* We'll start with the GET /api/v1/contacts/:contactId/ request, update it to the following code:
    ```
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
    ```
    * Now you should be able to get a contact as usual if the ID of the user in the JWT matches the user_id property in the request body, if they do not you should see the following response
    ```
    {
        "status": 403,
        "message": "You have insufficient permissions to access the Contact."
    }
    ```

* Next we'll update the POST request with the following code:
    ```
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

                res.status(responseData.status);
                res.json(responseData);
            }
        });
    });
    ```
    * Same as the GET requset, trying with different JWT with different users will result in different response depending on whether the IDs match up 

* Now we'll update the PUT request
    ```
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

                res.status(responseData.status);
                res.json(responseData);
            }
        });
    });
    ```

* And finally we'll update the DELETE request
    ```
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

                res.status(responseData.status);
                res.json(responseData);
            }
        });
    });
    ```

* Essentially all of our endpoints have been modified with the same code to compare the ID stored in req.decoded against the user_id of the contact. If they do not match we'll return with a 403 error, if they do match we'll handle the request and respond with the appropriate response

Completed code is available at: https://github.com/ShawnCC/web615_contactbook_backend/tree/week3

There was a lot of code covered this week, if you have any questions don't hesistate to ask questions during lab times, or email me at scrusvar@stclaircollege.ca