'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
 import { getContact, deleteContact } from '../../actions/contact.actions';


class Details extends React.Component {
    constructor() {
        super();
        this.deleteContact = this.deleteContact.bind(this);
        this.getContact = this.getContact.bind(this);
        this.initSocketEvents = this.initSocketEvents.bind(this);
    }

     initSocketEvents() {
        const { socketReducer } = this.props;
        const { socket } = socketReducer;

        socket.on('DELETE/api/v1/contacts/:contactId/', (payload) => {
            const contactId = this.props.match.params.contactId;

   
            if (payload.contactId.toString() === contactId.toString()) {
                this.context.store.dispatch(getContact(contactId));
            }
        });
    }

      deleteContact() {
            const { reducer } = this.props;
            const { contact } = reducer;
            this.context.store.dispatch(deleteContact(contact.id));
        }

    getContact() {
            const contactId = this.props.match.params.contactId;
            const { reducer } = this.props;
            const { contact } = reducer;

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

         componentDidDelete() {
            this.deleteContact();
        }

    render() {
        const { reducer } = this.props;
        const link = `/contacts/${ reducer.contact.id }/update/`;
        const linkdelete = `/contacts/${ reducer.contact.id }`;

        return (
            <div>
                <p><strong>Name:</strong> { reducer.contact.name }</p>
                <p><strong>Contact Name:</strong> { reducer.contact.contactname }</p>
                <p><strong>Superpower:</strong> { reducer.contact.superpower }</p>
                 <Link to={ link } className="btn btn-default">Update</Link>
                  <a href="#" onClick={ this.deleteContact } className="btn btn-default">Delete</a>
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