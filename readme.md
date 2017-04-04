# Using React-Router #

*Note: File is best viewed in a editor with markdown preview turned on*

Will start from where we left off last week, you can grab a copy of that code from here: https://github.com/ShawnCC/web615_contactbook_frontend/tree/week10

Be sure to install all depedencies for the application

Also you'll want to grab a copy of the backend code, all of our data will be coming from that now, we'll use the Week2 branch from here: https://github.com/ShawnCC/web615_contactbook_backend/tree/week2.

* We'll start by installing the new NPM package we'll need, run ``` npm i react-router-dom -D ```

* Next we'll open up /app/components/index/index.js 
    * Import react-router-dom components at the top of the file after React
    ```
    import { BrowserRouter, Route } from 'react-router-dom';
    ```
    * Next we'll wrap all of the HTML in our render function in the BrowserRouter component
    * Then we'll replace the Details component with the following:
    ```
    <Route exact path="/contacts/:contactId/" component={ Details }/>
    ```

* Now open up /app/components/contacts/contact/index.js
    * Lots of the code in this component can now be removed, we aren't going to intercept the click event, we'll now use the Link component to generate link, which will change the URL
    * Replace all the code in the component with the following:
    ```
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
            const link = `/contacts/${ contact.id }/`; // Create the URL for the contact
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
    ```
    * Now when we launch our app, we should be able to click a list item and see the URL change

* Next we'll do some updating to the organization of our application
    * Currently all of the actions live inside various files inside our app, we'll be starting to call those actions across multiple components, so instead of keep them spread across the app, we'll put shared actions in an actions directory
    * Create the directory "actions" in /app/
    * Create two files inside the new actions directory, one called "contact.actions.js" and another called "contacts.actions.js"
    * contact.actions.js will handle actions that involve a single contact, include the following code inside of it:
    ```
    'use strict';

    import axios from 'axios';

    import { getContacts } from './contacts.actions';

    /**
    * Send request to backend to get the contact
    * @param {Number|String} contactId - ID of the contact to get 
    */
    const getContact = (contactId) => {
        return (dispatch) => {
            dispatch(getContactStart);

            axios.get(`http://localhost:3001/api/v1/contacts/${ contactId }/`).then((response) => {
                dispatch(getContactDone(response.data.contact));
            }).catch((error) => {
                dispatch(getContactError({
                    error: error.response.data.message
                }));
            });
        };
    };

    /**
    * Emit start event
    */
    const getContactStart = () => {
        return {
            type: 'GET_CONTACT_START'
        };
    };

    /**
    * Emit done event
    * @param {Object} contact - The contact retrieved from the backend
    */
    const getContactDone = (contact) => {
        return {
            type: 'GET_CONTACT_DONE',
            payload: {
                contact
            }
        };
    };

    /**
    * Emit error event
    * @param {String} error - The error message from the backend
    */
    const getContactError = (error) => {
        return {
            type: 'GET_CONTACT_ERROR',
            payload: {
                error
            }
        };
    };

    /**
    * Send request to API to update the contact
    * @param {Object} contact - The contact to update
    */
    const updateContact = (contact) => {
        return (dispatch) => {
            dispatch(updateContactStart());

            axios.put(`http://localhost:3001/api/v1/contacts/${ contact.id }/`, {
                contact
            }).then((response) => {
                dispatch(updateContactDone());
                dispatch(getContact(contact.id));
                dispatch(getContacts());
            }).catch((error) => {
                dispatch(updateContactError({
                    error: error.response.data.message
                }));
            });
        };
    };

    /**
    * Emit start event
    */
    const updateContactStart = () => {
        return {
            type: 'CONTACT_UPDATE_START'
        };
    };

    /**
    * Emit done event
    */
    const updateContactDone = () => {
        return {
            type: 'CONTACT_UPDATE_DONE'
        };
    };

    /**
    * Emit error event
    * @param {String} error - The error message from the backend
    */
    const updateContactError = (error) => {
        return {
            type: 'CONTACT_UPDATE_ERROR',
            payload: {
                error
            }
        };
    };

    export {
        getContact,
        updateContact
    };
    ```
    * contacts.actions.js will handle actions that involve multiple contacts, include the following code inside of it:
    ```
    'use strict';

    import axios from 'axios';

    /**
    * Since this action will be async we will have to dispatch multiple actions to
    * let the user know what is happening. This functionality is given us to
    * redux-thunk
    */
    const getContacts = () => {
        return (dispatch) => {
            dispatch(getContactsStart);

            axios.get('http://localhost:3001/api/v1/contacts/').then((response) => {
                dispatch(getContactsDone({
                    contacts: response.data.contacts
                }));
            }).catch((error) => {
                dispatch(getContactsError({
                    error: error.response.data.message
                }));
            });
        };
    };

    /**
    * Emits the CONTACTS_GET_START event, this would be useful if we wanted to show
    * a loading animation
    */
    const getContactsStart = () => {
        return {
            type: 'CONTACTS_GET_START'
        };
    };

    /**
    * Emits the CONTACTS_GET_DONE event, any reducers that need data from this call
    * would listen for this event
    * @param {Object} payload - Response from the API call
    */
    const getContactsDone = (payload) => {
        return {
            type: 'CONTACTS_GET_DONE',
            payload
        };
    };

    /**
    * Emits the CONTACTS_GET_ERROR event, our global messages component will listen
    * for this event
    * @param {Object} payload - Reponse from API call
    */
    const getContactsError = (payload) => {
        return {
            type: 'CONTACTS_GET_ERROR',
            payload
        };
    };

    export {
        getContacts
    };
    ```

* Next open up /app/components/details/index.js
    * Since this component will be displaying the details of the Contact that was selected, we'll include the events to get the Contact here
    * Update the component to the following code:
    ```
    'use strict';

    import React from 'react';
    import { connect } from 'react-redux'
    import { Link } from 'react-router-dom';

    import { getContact } from '../../actions/contact.actions';

    class Details extends React.Component {
        constructor() {
            super();

            this.getContact = this.getContact.bind(this);
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
            reducer: state.detailsReducer
        };
    }

    Details = connect(
        mapStateToProps
    )(Details)

    export default Details;
    ```
    * Any existing functionality I won't update in these steps, however it should be as easy as importing the functions from these new files and using them in place of existing actions. I've done this in the completed code to clean things up, that code can be found in the link below

* Next open up the file /app/components/details/reducer.js
    * Replace "SET_CONTACT" with "GET_CONTACT_DONE" in the switch case
    * We can do the same for the reducer at /app/components/contacts/contact/reducer.js so our active state will update
    * Now we should be able to launch our app, click a list item and see the URL change, and the Contact update to match the URL

* Next we'll create a component to handle updating a contact
    * Create a directory called "update" in /app/components/
    * Inside the update directory create the following three files:
        * index.js
        * actions.js
        * reducer.js
    * Add the following code to index.js
    ```
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
    ```
    * Add the following code to actions.js
    ```
    'use strict';

    /**
    * Update contact name
    * @param {String} name - The new name for the contact
    */
    const updateContactName = (name) => {
        return {
            type: 'CONTACT_UPDATE_NAME',
            payload: {
                contact: {
                    name
                }
            }
        };
    };

    /**
    * Update contact email
    * @param {String} email - The new email for the contact
    */
    const updateContactEmail = (email) => {
        return {
            type: 'CONTACT_UPDATE_EMAIL',
            payload: {
                contact: {
                    email
                }
            }
        };
    };

    /**
    * Update contact phone number
    * @param {String} phoneNumber - The new phone number for the contact
    */
    const updateContactPhoneNumber = (phoneNumber) => {
        return {
            type: 'CONTACT_UPDATE_PHONE_NUMBER',
            payload: {
                contact: {
                    phone_number: phoneNumber
                }
            }
        };
    };

    export {
        updateContactName,
        updateContactEmail,
        updateContactPhoneNumber
    };
    ```
    * Add the following code to reducer.js
    ```
    'use strict';

    const defaultState = {
        contact: {}
    };

    const reducer = (state = defaultState, action) => {
        switch (action.type) {
            case 'GET_CONTACT_DONE': {
                return {
                    ...state,
                    contact: action.payload.contact
                };
            }
            case 'CONTACT_UPDATE_NAME': {
                return {
                    ...state,
                    contact: {
                        ...state.contact,
                        name: action.payload.contact.name
                    }
                };
            }
            case 'CONTACT_UPDATE_EMAIL': {
                return {
                    ...state,
                    contact: {
                        ...state.contact,
                        email: action.payload.contact.email
                    }
                };
            }
            case 'CONTACT_UPDATE_PHONE_NUMBER': {
                return {
                    ...state,
                    contact: {
                        ...state.contact,
                        phone_number: action.payload.contact.phone_number
                    }
                };
            }
            default: {
                return state;
            }
        }
    }

    export default reducer;
    ```
    * Now open up /app/reducers.js and import the new updateReducer and include it in combineReducers, reducers.js should now look like:
    ```
    import { combineReducers } from 'redux';

    // Import the reducers for all the components
    import contactsReducer from './components/contacts/reducer';
    import contactReducer from './components/contacts/contact/reducer';
    import detailsReducer from './components/details/reducer';
    import messagesReducer from './components/messages/reducer';
    import updateReducer from './components/update/reducer';

    // Call combineReducers method, pass all of our reducers into this method in order to create a single reducer
    const reducers = combineReducers({
        contactsReducer,
        contactReducer,
        detailsReducer,
        messagesReducer,
        updateReducer
    });

    export default reducers;
    ```
    * Finally open up /app/components/index/index.js and import the new Update component, and include it in the app via a Route component after the Details route
    ```
    <Route exact path="/contacts/:contactId/update/" component={ Update }/>
    ```
    * The /app/components/index/index.js should now look like:
    ```
    'use strict';

    // Include any necessary libraries
    import React from 'react';
    import { BrowserRouter, Route } from 'react-router-dom';

    // Include any necessary components
    import Header from '../header';
    import Messages from '../messages';
    import Contacts from '../contacts';
    import Details from '../details';
    import Update from '../update';

    // Create a component based off the React component class
    export default class Index extends React.Component {
        /**
        * Class constructor, we don't technically need this, however I always
        * include it out of habit
        * One thing to note, is that if we do include a constructor we must call
        * super() inside of it before anything else as it is a subclass 
        */
        constructor() {
            super();
        }

        /**
        * Render is what will be rendered to the DOM
        * Syntax inside return is JSX (essentially HTML in JavaScript), with a few
        * differences, the most common ones I encounter are:
        * 1. As you can see we cannot use "class" for our HTML classes we must use
        *   "className" since "class" is a keyword in JavaScript
        * 2. All tags must close so <input type="text"> would be invalid, you'd
        *   have to do it like so <input type="text"/>
        * 3. A render function must return only one root element (this include comments and any brackets), in this case a <div>
        * 4. Comments must be wrapped in brackets
        */
        render() {
            return (
                <BrowserRouter>
                    <div className="container"> {/* Create our root element */}
                        {/* Include self closing header element */}
                        <Header/>
                        <Messages/>
                        <div className="row">
                            <div className="col-xs-4">
                                {/* Include self closing contacts element */}
                                <Contacts/>
                            </div>
                            <div className="col-xs-8">
                                <Route exact path="/contacts/:contactId/" component={ Details }/>
                                <Route exact path="/contacts/:contactId/update/" component={ Update }/>
                            </div>
                        </div>
                    </div>
                </BrowserRouter>
            );
        }
    }
    ```
    * We should now be able to click into a list item, click the update button and be directed to a form with that Contacts data, if we update the data and submit the form our Contact should be updated

Completed code is available at: https://github.com/ShawnCC/web615_contactbook_frontend/tree/week11

I've also done a bit more clean up in the completed code, mostly involving the moving of actions to point to the files in the actions directory