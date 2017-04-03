'use strict';

import React from 'react';
import { connect } from 'react-redux';

// Import the action(s)
import { setContact } from './actions';

class Contact extends React.Component {
    constructor() {
        super();

        // We must bind "this" from the class to the handleClick method, this
        // will allow us to grab props, context, and whatever other properties
        // of the parent class we need
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Handle the click event
     * @param {Object} e - Event object
     */
    handleClick(e) {
        e.preventDefault();

        // Grab the contact from props
        const { contact } = this.props;

        // Dispatch the action, passing the contact to the action
        this.context.store.dispatch(setContact({
            contact
        }));
    }

    render() {
        // Grab the contact property from the props object which is provided by
        // the parent component. Google "Object destructuring" if you are
        // unfamilair with this syntax
        const { contact, reducer } = this.props;

        let cssClasses = 'list-group-item';

        if (contact.id === reducer.contact.id) {
            cssClasses += ' active';
        }
        
        /**
         * Print out the properties of the contact to the list item
         */
        return (
            <a href="#" className={ cssClasses } onClick={ this.handleClick }>{ contact.name }</a>
        );
    }
}

Contact.propTypes = {
    contact: React.PropTypes.object.isRequired
};

Contact.contextTypes = {
    store: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        reducer: state.contactReducer
    };
}

Contact = connect(
    mapStateToProps
)(Contact)

export default Contact;