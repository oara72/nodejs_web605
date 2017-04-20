'use strict';

/**
 * Update contact name
 * @param {String} name - The new name for the contact
 */
const updateContactName = (name) => {
    return {
        type: 'CONTACT_UPDATE_NAME',
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
const updateContactEmail = (email) => {
    return {
        type: 'CONTACT_UPDATE_EMAIL',
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
const updateContactPhoneNumber = (phoneNumber) => {
    return {
        type: 'CONTACT_UPDATE_PHONE_NUMBER',
        payload: {
            contact: {
                phone_number: phoneNumber
            }
        }
    };
};

export {
    updateContactName,
    updateContactEmail,
    updateContactPhoneNumber
};