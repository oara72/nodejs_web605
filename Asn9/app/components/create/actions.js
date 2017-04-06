'use strict';

    /**
    * Update contact name
    * @param {String} name - The new name for the contact
    */
    const createContactName = (name) => {
        return {
            type: 'CONTACT_CREATE_NAME',
            payload: {
                contact: {
                    name
                }
            }
        };
    };

    /**
    * Update contact email
    * @param {String} email - The new email for the contact
    */
    const createContactEmail = (email) => {
        return {
            type: 'CONTACT_CREATE_EMAIL',
            payload: {
                contact: {
                    email
                }
            }
        };
    };

    /**
    * Update contact phone number
    * @param {String} phoneNumber - The new phone number for the contact
    */
    const createContactPhoneNumber = (phoneNumber) => {
        return {
            type: 'CONTACT_CREATE_PHONE_NUMBER',
            payload: {
                contact: {
                    phone_number: phoneNumber
                }
            }
        };
    };

    export {
        createContactName,
        createContactEmail,
        createContactPhoneNumber
    };