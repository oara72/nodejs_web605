'use strict';

import React from 'react';

import Contact from './contact';

export default class Contacts extends React.Component {
    constructor() {
        super();

        // Create some dummy contacts inside the constructor so we can populate
        // child elements
        this.contacts = [
            {
                id: 1,
                name: 'Contact 1',
                phone_number: '555 555 5555'
            },
            {
                id: 2,
                name: 'Contact 2',
                phone_number: '555 555 5555'
            },
            {
                id: 3,
                name: 'Contact 3',
                phone_number: '555 555 5555'
            }
        ];
    }

    render() {
        // Loop through all of the contacts that were created in the constructor
        // and create a <Contact> component for each of them. We pass the data
        // for the contact through the contact attribute, as well as pass the
        // contact ID to the key attribute
        // Note: The key attribute must be unique for each component, so
        // something that will be unique like an ID works best
        let listItems = this.contacts.map((contact) => {
            return <Contact key={ contact.id } contact={ contact }></Contact>
        });

        return (
            <div className="list-group">
                {/* Render the list items to the DOM */}
                { listItems }
            </div>
        );
    }
}