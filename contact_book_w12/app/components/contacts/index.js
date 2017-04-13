'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Contact from './contact';

import { getContacts } from './actions';

class Contacts extends React.Component {
    constructor() {
        super();

        this.getContacts = this.getContacts.bind(this);
        this.initSocketEvents = this.initSocketEvents.bind(this);
    }
    
    initSocketEvents() {

       /* this.props.socketReducer.socket.on('POST/api/v1/contacts/:contactId/', (data) => {
             this.getContacts();
        });

        this.props.socketReducer.socket.on('PUT/api/v1/contacts/:contactId/', (data) => {
             this.getContacts();
        });

        this.props.socketReducer.socket.on('DELETE/api/v1/contacts/:contactId/', (data) => {
             this.getContacts();
        });*/

        const { socketReducer } = this.props;
        const { socket } = socketReducer;

        socket.on ('DELETE/api/v1/contacts/', () => {
             this.getContacts();
        });
    }

    getContacts() {
        this.context.store.dispatch(getContacts());
    }


    

    componentWillMount() {
        this.getContacts();
        this.initSocketEvents();
    }

    render() {
        const { reducer } = this.props;

        let listItems = reducer.contacts.map((contact) => {
            return <Contact key={ contact.id } contact={ contact }></Contact>
        });

        const link = `/contacts/create/`;

        return (
            <div className="list-group">
                {/* Render the list items to the DOM */}
                <Link to={ link } className="btn btn-default">Create New Hero</Link>
                <br/><br/>
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

/**
 * This will set up the various reducers as props in our component
 * @param {Object} state - The store for our application, contains all reducers
 */
function mapStateToProps(state) {
    return {
        reducer: state.contactsReducer,
        socketReducer : state.socketReducer
    };
}

Contacts = connect(
    mapStateToProps
)(Contacts)

export default Contacts;