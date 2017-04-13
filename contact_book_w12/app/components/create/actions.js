'use strict';

    /**
    * @param {String} name - 
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
    * @param {String} contactname - 
    */
    const createContactContactName = (contactname) => {
        return {
            type: 'CONTACT_CREATE_CONTACTNAME',
            payload: {
                contact: {
                    contactname
                }
            }
        };
    };

    /**
    * @param {String} superpower 
    */
    const createContactSuperpower = (superpower) => {
        return {
            type: 'CONTACT_CREATE_SUPERPOWER',
            payload: {
                contact: {
                    superpower
                }
            }
        };
    };

    export {
        createContactName,
        createContactContactName,
        createContactSuperpower
    };