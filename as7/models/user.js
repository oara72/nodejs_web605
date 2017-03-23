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
        }
    });

    return User;
};
