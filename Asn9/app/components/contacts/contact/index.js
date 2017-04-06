'use strict';

    import React from 'react';
    import { connect } from 'react-redux';
    import { Link } from 'react-router-dom';

    class Contact extends React.Component {
        constructor() {
            super();
        }

        render() {
            const { contact, reducer } = this.props;
            const link = `/contacts/${ contact.id }/details`; // Create the URL for the contact
            let cssClasses = 'list-group-item';

            if (contact.id === reducer.contact.id) {
                cssClasses += ' active';
            }
            
            /**
            * Use the Link component to render a <a>, when can be used to change the URL
            */
            return (
                <Link to={ link } className={ cssClasses }>{ contact.name }</Link>
            );
        }
    }

    Contact.propTypes = {
        contact: React.PropTypes.object.isRequired
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
    