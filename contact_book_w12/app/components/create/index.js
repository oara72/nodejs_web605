'use strict';

    import React from 'react';
    import { connect } from 'react-redux'

    import Header from '../header';
    import Messages from '../messages';

    import { createContactName, createContactContactName, createContactSuperpower } from './actions';
    import { createContact } from '../../actions/contact.actions';

    class Index extends React.Component {
        constructor() {
            super();

            this.handleSubmit = this.handleSubmit.bind(this);
            this.handleNameChange = this.handleNameChange.bind(this);
            this.handleContactNameChange = this.handleContactNameChange.bind(this);
            this.handleSuperpowerChange = this.handleSuperpowerChange.bind(this);
        }

        handleSubmit(e) {
            e.preventDefault();

            const { reducer } = this.props;
            const { contact } = reducer;

            this.context.store.dispatch(createContact(contact));
            this.props.history.replace(`/contacts/${ contact.id }/`);
        }

        handleNameChange(e) {
            let name = e.target.value;

            this.context.store.dispatch(createContactName(name));
        }

        handleContactNameChange(e) {
            let contactname = e.target.value;

            this.context.store.dispatch(createContactContactName(contactname));
        }

        handleSuperpowerChange(e) {
            let superpower = e.target.value;
            this.context.store.dispatch(createContactSuperpower(superpower));
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
                            onChange={ this.handleNameChange }/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactname">Contact Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="contactname"
                            placeholder="Contact Name"
                            onChange={ this.handleContactNameChange }/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="superpower">Superpower</label>
                        <input
                            type="text"
                            className="form-control"
                            id="superpower"
                            placeholder="Superpower"
                            onChange={ this.handleSuperpowerChange }/>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Hero</button>
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
            reducer: state.createReducer
        };
    }

    Index = connect(
        mapStateToProps
    )(Index)

    export default Index;