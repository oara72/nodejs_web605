'use strict';

import React from 'react';
import { connect } from 'react-redux'

import Header from '../header';
import Messages from '../messages';

import { updateContactName, updateContactEmail, updateContactPhoneNumber } from './actions';
import { updateContact } from '../../actions/contact.actions';

class Index extends React.Component {
    constructor() {
        super();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    }

    /**
     * Handle form submission
     * Dispatch event to send update request to API
     */
    handleSubmit(e) {
        e.preventDefault();

        const { reducer } = this.props;
        const { contact } = reducer;

        this.context.store.dispatch(updateContact(contact));
        this.props.history.replace(`/contacts/${ contact.id }/`);
    }

    /**
     * Handle field update
     * Dispatch event to update contact properties
     * We have to make methods to update the reducer as changes come in since
     * all state should be kept in a reducer
     */
    handleNameChange(e) {
        let name = e.target.value;

        this.context.store.dispatch(updateContactName(name));
    }

    handleEmailChange(e) {
        let email = e.target.value;

        this.context.store.dispatch(updateContactEmail(email));
    }

    handlePhoneNumberChange(e) {
        let phoneNumber = e.target.value;

        this.context.store.dispatch(updateContactPhoneNumber(phoneNumber));
    }

    render() {
        const { reducer } = this.props;
        const { contact } = reducer;

        return (
            <form onSubmit={ this.handleSubmit }>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Name"
                        value={ contact.name }
                        onChange={ this.handleNameChange }/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Email"
                        value={ contact.email }
                        onChange={ this.handleEmailChange }/>
                </div>
                <div className="form-group">
                    <label htmlFor="phone_number">Phone Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phone_number"
                        placeholder="Phone Number"
                        value={ contact.phone_number }
                        onChange={ this.handlePhoneNumberChange }/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        );
    }
}

Index.propTypes = {
    reducer: React.PropTypes.object.isRequired
};

Index.contextTypes = {
    store: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        reducer: state.updateReducer
    };
}

Index = connect(
    mapStateToProps
)(Index)

export default Index;