'use strict';

const bcrypt = require('bcrypt');
// Number of rounds the password is run through a hashing algorithm. The more rounds the more secure, but also the more time consuming
const saltRounds = 10;

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

        classMethods: {
            associate: (models) => {
                User.hasMany(models.contact, {
                    onDelete: 'CASCADE'
                });
            }
        },

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

        hooks: {
            beforeCreate: (instance) => {
                instance.password = bcrypt.hashSync(instance.password, saltRounds);
            }
        }
    });

    return User;
};