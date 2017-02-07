    'use strict';

    module.exports = (sequelize, DataTypes) => {
        var Contact = sequelize.define('contact', {
                // Creates a name property as a string, and enforces that it is a required field
                name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: true
                    }
                },
                // Creates a email property as a string
                email: DataTypes.STRING,
                // Creates a phone number property as a string
                phone_number: DataTypes.STRING
        }, {
            // Gives us two additional properties created_at and updated_at in our model
            timestamps: true,
            // Ensures that multi-word models are separated with an _
            underscored: true
        });

        // Return the model so it can be loaded in
        return Contact;
    };