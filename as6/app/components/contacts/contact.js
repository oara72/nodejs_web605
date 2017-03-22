'use strict';

import React from 'react';

export default class Contact extends React.Component {
    constructor() {
        super();
    }

    render() {
        // Grab the contact property from the props object which is provided by
        // the parent component. Google "Object destructuring" if you are
        // unfamilair with this syntax
        const { contact } = this.props;
        
        /**
        * Print out the properties of the contact to the list item
        */
        return (
            <a href="#" className="list-group-item">{ contact.name } - { contact.phone_number }</a>
        );
    }
}