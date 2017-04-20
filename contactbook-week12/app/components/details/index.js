'use strict';

import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import { getContact } from '../../actions/contact.actions';

class Details extends React.Component {
    constructor() {
        super();

        this.getContact = this.getContact.bind(this);
        this.initSocketEvents = this.initSocketEvents.bind(this);
    }

    /**
     * Setup listeners for sockets
     */
    initSocketEvents() {
        const { socketReducer } = this.props;
        const { socket } = socketReducer;

        socket.on('PUT/api/v1/contacts/:contactId/', (payload) => {
            const contactId = this.props.match.params.contactId;

            // We'll directory dispatch the event here instead of calling
            // this.getContact, since this.getContact has other checks which we
            // won't be able to pass using sockets
            if (payload.contactId.toString() === contactId.toString()) {
                this.context.store.dispatch(getContact(contactId));
            }
        });
    }

    /**
     * Dispatch action to get the contact
     */
    getContact() {
        const contactId = this.props.match.params.contactId;
        const { reducer } = this.props;
        const { contact } = reducer;

        // Since this methods fires on componentDidUpdate we must do some checks
        // to ensure we only dispatch the event when the contact ID in the URL
        // is different than the ID of the contact in the reducer. If we don't
        // we'll get a endless loop of requests to our backend
        if (!contact.id || contact.id.toString() !== contactId) {
            this.context.store.dispatch(getContact(contactId));
        }
    }

    componentWillMount() {
        this.getContact();
        this.initSocketEvents();
    }

    componentDidUpdate() {
        this.getContact();
    }

    render() {
        const { reducer } = this.props;
        const link = `/contacts/${ reducer.contact.id }/update/`;

        return (
            <div>
                <p><strong>Name:</strong> { reducer.contact.name }</p>
                <p><strong>Email:</strong> { reducer.contact.email }</p>
                <p><strong>Phone Number:</strong> { reducer.contact.phone_number }</p>

                <Link to={ link } className="btn btn-default">Update</Link>
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
        reducer: state.detailsReducer,
        socketReducer: state.socketReducer
    };
}

Details = connect(
    mapStateToProps
)(Details)

export default Details;