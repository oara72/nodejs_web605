'use strict';

    import React from 'react';
    import { connect } from 'react-redux'

    import Header from '../header';
    import Messages from '../messages';

    import { updateContactName, updateContactContactName, updateContactSuperpower } from './actions';
    import { updateContact } from '../../actions/contact.actions';

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

            this.context.store.dispatch(updateContact(contact));
            this.props.history.replace(`/contacts/${ contact.id }/`);
        }

        handleNameChange(e) {
            let name = e.target.value;

            this.context.store.dispatch(updateContactName(name));
        }

        handleContactNameChange(e) {
            let contactname = e.target.value;

            this.context.store.dispatch(updateContactContactName(contactname));
        }

        handleSuperpowerChange(e) {
            let superpower = e.target.value;

            this.context.store.dispatch(updateContactSuperpower(superpower));
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
                        <label htmlFor="contactname">Contact Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="contactname"
                            placeholder="Contact Name"
                            value={ contact.contactname }
                            onChange={ this.handleContactNameChange }/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="superpower">Superpower</label>
                        <input
                            type="text"
                            className="form-control"
                            id="superpower"
                            placeholder="Superpower"
                            value={ contact.superpower }
                            onChange={ this.handleSuperpowerChange }/>
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