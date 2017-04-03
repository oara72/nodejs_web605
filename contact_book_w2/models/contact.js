'use strict';

module.exports = (sequelize, DataTypes) => {
    var Contact = sequelize.define('contact', {
            name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true
                }
            },
            email: DataTypes.STRING,
            phone_number: DataTypes.STRING
    }, {
        timestamps: true,

        underscored: true,

        classMethods: {
            associate: (models) => {
                Contact.belongsTo(models.user, {
                    onDelete: 'CASCADE'
                });
            }
        }
    });

    return Contact;
};
