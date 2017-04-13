'use strict';

    /**
    * @param {String} name - 
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
    
    * @param {String} contactname - 
    */
    const updatecontactContactName = (contactname) => {
        return {
            type: 'CONTACT_UPDATE_CONTACTNAME',
            payload: {
                contact: {
                    contactname
                }
            }
        };
    };

    /**
    * @param {String} superpower - 
    */
    const updateContactSuperpower = (superpower) => {
        return {
            type: 'CONTACT_UPDATE_SUPERPOWER',
            payload: {
                contact: {
                    superpower
                }
            }
        };
    };

    export {
        updateContactName,
        updateContactContactName,
        updateContactSuperpower
    };