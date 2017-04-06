'use strict';

    import React from 'react';
    import { connect } from 'react-redux'
    import { Link } from 'react-router-dom';

    import { getContact, deleteContact } from '../../actions/contact.actions';


    class Details extends React.Component {
        constructor() {
            super();
            this.deleteContact = this.deleteContact.bind(this);
            this.getContact = this.getContact.bind(this);
        }


        deleteContact() {
            const { reducer } = this.props;
            const { contact } = reducer;
            this.context.store.dispatch(deleteContact(contact.id));
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
                    <p><strong>Email:</strong> { reducer.contact.email }</p>
                    <p><strong>Phone Number:</strong> { reducer.contact.phone_number }</p>

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
            reducer: state.detailsReducer
        };
    }

    Details = connect(
        mapStateToProps
    )(Details)

    export default Details;