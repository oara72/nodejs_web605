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