# Integrating Relationships into our API 

*Note: File is best viewed in a editor with markdown preview turned on*

You'll want to grab a copy of the code as it stands from our last lesson. A copy of the code can be found at: https://github.com/ShawnCC/web615_contactbook_backend/tree/week1

Be sure to install all dependencies for the project before you go any further

* We'll start by creating a new model
    * In the models directory create a file called "user.js"
    * Add the following to the file:
    ```
    'use strict';

    module.exports = (sequelize, DataTypes) => {
        var User = sequelize.define('user', {
                name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: true
                    }
                },
                email: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: true
                    },
                    // Ensure that the email cannot be duplicated across models
                    unique: true
                },
                password: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: true
                    }
                }
        }, {
            timestamps: true,

            underscored: true,

            // All relationships are created here
            classMethods: {
                associate: (models) => {
                    // Creates a one-to-many relationship between User and Contact
                    // States that a User has many Contacts
                    // Also sets it so that when the User is deleted all of its Contacts are as well
                    User.hasMany(models.contact, {
                        onDelete: 'CASCADE'
                    });
                }
            }
        });

        return User;
    };
    ```

* With the new User model in place we'll need to make some modifications to the existing Contact model
    * Open the file "contact.js" in the model directory
    * In the class methods object in the associate function add the following code:
    ```
    // States that the Contact model belongs to the User model
    // Also sets it so that when the User is deleted all of its Contacts are as well
    Contact.belongsTo(models.user, {
        onDelete: 'CASCADE'
    });
    ```

* With the updates completed to our Contact model we can now create endpoints to take advantage of this functionality
    * First create a new file called "users.js" in /routes/api/v1/
    * Add the following to that file:
    ```
    'use strict';

    const express = require('express');
    const router = express.Router();
    const async = require('async');
    const models = require('../../../models');



    module.exports = router;
    ```

* Now open up the app.js file in the root of our project
    * Underneath where we previously setup the contact routes we'll setup out user routes
    * Require in the user route file with ``` const v1Users = require('./routes/api/v1/users'); ```
    * Set that file to be used for any /user/ requests ``` app.use('/api/v1/users', v1Users); ```

* With that in place we can start creating our endpoints for user, we'll first create the boilerplate get, post, put, delete endpoints

* Open up the users.js file in routes

* We'll create our get all users with the following code:
```
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
```

* We should now be able to query GET /api/v1/users/ and get a list of existing users

* We'll create our POST to create a user with the following code:
```
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
```

* We should now be able to query POST /api/v1/users/ and create a user

* We'll create our PUT to update a user with the following code:
```
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
            user.password = req.body.user.phone_number;

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
```

* We should now be able to query PUT /api/v1/users/:userId/ and update a user

* We'll create our DELETE to delete a user with the following code:
```
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
```

* We should now be able to query DELETE /api/v1/users/:userId/ and delete a user

* With the boilerplate requests out of the way we'll now create a request to query for a user and all of its Contacts
    * After our GET all users request add the following code:
    ```
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
    ```

* To test our new endpoint we'll need to create some rows in the database first. Create the following using Postman
    * Create a user
    * Create a contact (be sure to pass in the "user_id" of the newly created user in the request body)

* With those in place you should now be able to query GET /api/v1/users/:userId/contacts/ and get the following data returned:
```
{
  "status": 200,
  "message": "User retrieved successfully!",
  "user": {
    "id": 1,
    "name": "Shawn",
    "email": "shawn@email.com",
    "created_at": "2017-01-15T21:16:08.486Z",
    "updated_at": "2017-01-15T21:16:08.486Z",
    "contacts": [
      {
        "id": 1,
        "name": "Contact 1",
        "email": "contact@email.com",
        "phone_number": "555 555 5555",
        "created_at": "2017-01-15T21:16:24.246Z",
        "updated_at": "2017-01-15T21:16:24.246Z",
        "user_id": 1
      }
    ]
  }
}
```

* With all that in place we should have a new user model created, a relationship between users and contacts, and the following new endpoints:
    * GET /api/v1/users/
    * GET /api/v1/users/:userId/contacts/
    * POST /api/v1/users/
    * PUT /api/v1/users/:userId/
    * DELETE /api/v1/users/:userId/

Completed code is available at: https://github.com/ShawnCC/web615_contactbook_backend/tree/week2


{
"user": {
"name": "Tyrion Lannister",
"email": "casterlyrock@email.com",
"phone_number": "555 555 5555"
    }
}

{
"contact": {
"name": "tywinlannister",
"email": "casterlyrock@email.com",
"phone_number": "555 555 5555",
"user_id": 3
}
}

