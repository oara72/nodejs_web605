'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteContact } from './actions';

class Details extends React.Component {
    constructor() {
        super();
        this.deleteContact = this.deleteContact.bind(this);
    }

 

    deleteContact() {
        const { reducer } = this.props;
        const { contact } = reducer;
        this.context.store.dispatch(deleteContact(contact.id));
       
    }

    render() {
        const { reducer } = this.props;
        const link = `/contacts/${ reducer.contact.id }`;

        return (
            <div>
                <p><strong>Name:</strong> { reducer.contact.name }</p>
                <p><strong>Email:</strong> { reducer.contact.email }</p>
                <p><strong>Phone Number:</strong> { reducer.contact.phone_number }</p>
                <p><button href="#" onClick={ this.deleteContact }>Delete {link}</button></p>
            </div>
        );
    }
}

Details.propTypes = {
    reducer: React.PropTypes.object.isRequired
};

Details.contextTypes = {
    store: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        reducer: state.detailsReducer
    };
}

Details = connect(
    mapStateToProps
)(Details)

export default Details;