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
            const link = `/contacts/${ contact.id }/details`; 
            let cssClasses = 'list-group-item';

            if (contact.id === reducer.contact.id) {
                cssClasses += ' active';
            }
            
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