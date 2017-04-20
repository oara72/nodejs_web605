'use strict';

import React from 'react';
import { connect } from 'react-redux';

import Contact from './contact';

import { getContacts } from '../../actions/contacts.actions';

class Contacts extends React.Component {
    constructor() {
        super();

        this.getContacts = this.getContacts.bind(this);
        this.initSocketEvents = this.initSocketEvents.bind(this);
    }

    /**
     * Setup listeners for sockets
     */
    initSocketEvents() {
        const { socketReducer } = this.props;
        const { socket } = socketReducer;

        socket.on('PUT/api/v1/contacts/:contactId/', ()=> {
            this.getContacts();
        });
    }
    
    /**
     * Dispatch action to get the contacts
     */
    getContacts() {
        this.context.store.dispatch(getContacts());
    }

    /**
     * Method built into React.Component, this is called right before the
     * component renders for the first time
     */
    componentWillMount() {
        this.getContacts();
        this.initSocketEvents();
    }

    render() {
        const { reducer } = this.props;

        // Loop through all of the contacts that were created in the constructor
        // and create a <Contact> component for each of them. We pass the data
        // for the contact through the contact attribute, as well as pass the
        // contact ID to the key attribute
        // Note: The key attribute must be unique for each component, so
        // something that will be unique like an ID works best
        let listItems = reducer.contacts.map((contact) => {
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

// Denote what props our component should be expecting, if one is missing it
// will throw an error in the console
Contacts.propTypes = {
    reducer: React.PropTypes.object.isRequired
};

Contacts.contextTypes = {
    store: React.PropTypes.object
};

/**
 * This will set up the various reducers as props in our component
 * @param {Object} state - The store for our application, contains all reducers
 */
function mapStateToProps(state) {
    return {
        reducer: state.contactsReducer,
        socketReducer: state.socketReducer
    };
}

// Connects our component to the store
Contacts = connect(
    mapStateToProps
)(Contacts)

export default Contacts;