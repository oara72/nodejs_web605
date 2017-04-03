'use strict';

import React from 'react';
import { connect } from 'react-redux';
import Contact from './contact';
import { getContacts } from './actions';

class Contacts extends React.Component {
    constructor() {
        super();
        this.getContacts = this.getContacts.bind(this);
    }
    
    /**
     * Dispatch action to get the contacts
     */
    getContacts() {
        this.context.store.dispatch(getContacts());
    }

   
    componentWillMount() {
        this.getContacts();
    }

    render() {
        const { reducer } = this.props;

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


Contacts.propTypes = {
    reducer: React.PropTypes.object.isRequired
};

Contacts.contextTypes = {
    store: React.PropTypes.object
};


function mapStateToProps(state) {
    return {
        reducer: state.contactsReducer
    };
}


Contacts = connect(
    mapStateToProps
)(Contacts)

export default Contacts;