# Consuming APIs with Redux #

*Note: File is best viewed in a editor with markdown preview turned on*

Will start from where we left off last week, you can grab a copy of that code from here: [https://github.com/ShawnCC/web615_contactbook_frontend/tree/week9](https://github.com/ShawnCC/web615_contactbook_frontend/tree/week9)

Be sure to install all depedencies for the application

Also you'll want to grab a copy of the backend code, all of our data will be coming from that now, we'll use the Week2 branch from here: [https://github.com/ShawnCC/web615_contactbook_backend/tree/week2](https://github.com/ShawnCC/web615_contactbook_backend/tree/week2). If you want to use your own backend be sure add the following in app.js:
```
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
```
* We'll start by installing the following dependencies Axios and Redux-Thunk with ``` npm i axios redux-thunk -D ```
    * Axios will be the library we use to make calls to our API, and thunk allows async requests in Redux

* Now open up app.js and import thunk with ``` import thunk from 'redux-thunk'; ``` after our other import statements

* Then will add thunk to the createMiddleware function so that line will now look like ``` let store = createStore(reducers, applyMiddleware(createLogger(), thunk)); ```

* Now we'll create a file called actions.js in /app/components/contacts, in that file will add the following code:
    * That will make our requests to our API and emit an event when it starts, finishes or errors out
```
'use strict';

import axios from 'axios';

// Import action from a different file
import { setContact } from './contact/actions';

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

            if (response.data.contacts && response.data.contacts.length) {
                dispatch(setContact({
                    contact: response.data.contacts[0]
                }));
            }
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

* Now open up index.js in /app/components/contacts/
    * Import getContacts from actions.js with the following ``` import { getContacts } from './actions'; ```
    * Create a getContacts method to call the action with
    ```
    /**
     * Dispatch action to get the contacts
     */
    getContacts() {
        this.context.store.dispatch(getContacts());
    }
    ```
    * Bind the getContacts method in the constructor with
    ```
    this.getContacts = this.getContacts.bind(this);
    ```
    * Call the getContacts method in the componentWillMount method with
    ```
    /**
     * Method built into React.Component, this is called right before the
     * component renders for the first time
     */
    componentWillMount() {
        this.getContacts();
    }
    ```
    * Finally will add the store to the components context with:
    ```
    Contacts.contextTypes = {
        store: React.PropTypes.object
    };
    ```
    * With those in place the component should now look like:
    ```
    'use strict';

    import React from 'react';
    import { connect } from 'react-redux';

    import Contact from './contact';

    import { getContacts } from './actions';

    class Contacts extends React.Component {
        constructor() {
            super();

            this.getContacts = this.getContacts.bind(this);
        }
        
        /**
        * Dispatch action to get the contacts
        */
        getContacts() {
            this.context.store.dispatch(getContacts());
        }

        /**
        * Method built into React.Component, this is called right before the
        * component renders for the first time
        */
        componentWillMount() {
            this.getContacts();
        }

        render() {
            const { reducer } = this.props;

            // Loop through all of the contacts that were created in the constructor
            // and create a <Contact> component for each of them. We pass the data
            // for the contact through the contact attribute, as well as pass the
            // contact ID to the key attribute
            // Note: The key attribute must be unique for each component, so
            // something that will be unique like an ID works best
            let listItems = reducer.contacts.map((contact) => {
                return <Contact key={ contact.id } contact={ contact }></Contact>
            });

            return (
                <div className="list-group">
                    {/* Render the list items to the DOM */}
                    { listItems }
                </div>
            );
        }
    }

    // Denote what props our component should be expecting, if one is missing it
    // will throw an error in the console
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
            reducer: state.contactsReducer
        };
    }

    // Connects our component to the store
    Contacts = connect(
        mapStateToProps
    )(Contacts)

    export default Contacts;
    ```

* Now will modify our existing reducer for contacts, open up /app/components/contacts/reducer.js
    * Empty our hardcoded data from the contacts array in defaultState
    * Add the "CONTACTS_GET_DONE" case to the switch statement with:
    ```
    case 'CONTACTS_GET_DONE': {
        return {
            ...state,
            contacts: action.payload.contacts
        };
    }
    ```
    * Our reducer should now look like:
    ```
    'use strict';

    // Create some dummy data for our list, this will eventually be replaced with
    // data from our API 
    const defaultState = {
        contacts: []
    };

    /**
    * This sets the state of our component, it listen to events from actions. It
    * will listen to all events, so you must return a default which will maintain
    * the state
    * @param {Object} state - The state for our reducer, by default it will be
    *   whatever we've put in the default state object
    * @param {Object} action - The action dispatched, this will have to properties
    * @param {String} action.type - The type of action dispatch, think of it as the
    *   name of the action
    * @param {Object} payload - Values to update our state with
    */
    const reducer = (state = defaultState, action) => {
        switch (action.type) {
            case 'CONTACTS_GET_DONE': {
                return {
                    ...state,
                    contacts: action.payload.contacts
                };
            }
            default: {
                return state;
            }
        }
    }

    export default reducer;
    ```

* We can now run our app with ``` npm run server ``` and we should see the data from our backend be automatically loaded in (Be sure to have the backend app running)

* Finally we'll create another component and reducer to catch any errors that may occur
    * In /app/components/ create a directory called "messages"
    * In the "messages" directory create the following files: 
        * index.js
        * reducer.js
    * Add the following to the new reducer.js file:
    ```
    'use strict';

    const defaultState = {
        success: '',
        info: '',
        warning: '',
        error: ''
    };

    /**
    * This reducer will listen for all the error events
    */
    const reducer = (state = defaultState, action) => {
        switch (action.type) {
            case 'CONTACTS_GET_ERROR': {
                return {
                    ...state,
                    error: action.payload.error
                };
            }
            default: {
                return state;
            }
        }
    }

    export default reducer;
    ```
    * Import the new reducer to reducers.js in app/reducers.js call it messagesReducer, reducers.js should now look like:
    ```
    import { combineReducers } from 'redux';

    // Import the reducers for all the components
    import contactsReducer from './components/contacts/reducer';
    import contactReducer from './components/contacts/contact/reducer';
    import detailsReducer from './components/details/reducer';
    import messagesReducer from './components/messages/reducer';

    // Call combineReducers method, pass all of our reducers into this method in order to create a single reducer
    const reducers = combineReducers({
        contactsReducer,
        contactReducer,
        detailsReducer,
        messagesReducer
    });

    export default reducers;
    ```
    * Now open up index.js in /app/components/messages and add the following:
    ```
    'use strict';

    import React from 'react';
    import { connect } from 'react-redux'

    class Messages extends React.Component {
        constructor() {
            super();
        }

        render() {
            const { reducer } = this.props;

            // Determining the css classes, only show the alerts that have content
            let successCssClass = reducer.success ? 'alert alert-success' : 'hidden';
            let infoCssClass = reducer.info ? 'alert alert-info' : 'hidden';
            let warningCssClass = reducer.warning ? 'alert alert-warning' : 'hidden';
            let dangerCssClass = reducer.error ? 'alert alert-danger' : 'hidden';

            return (
                <div>
                    <div className={ successCssClass } role="alert">{ reducer.success }</div>
                    <div className={ infoCssClass } role="alert">{ reducer.info }</div>
                    <div className={ warningCssClass } role="alert">{ reducer.warning }</div>
                    <div className={ dangerCssClass } role="alert">{ reducer.error }</div>
                </div>
            );
        }
    }

    Messages.propTypes = {
        reducer: React.PropTypes.object.isRequired
    };

    function mapStateToProps(state) {
        return {
            reducer: state.messagesReducer
        };
    }

    Messages = connect(
        mapStateToProps
    )(Messages)

    export default Messages;
    ```
    * Finally we'll include the messages component in /app/components/index/index.js
        * Import the messages component with ``` import Messages from '../messages'; ```
        * Add the <Messages/> element directory underneath the <Header/> in the render method
    * With all that in place, our app can handle any errors given returned from the API, keep in mind as the app grows we'd have to include any new errors we'd want to catch in the messages reducer

Completed code is available at: [https://github.com/ShawnCC/web615_contactbook_frontend/tree/week10](https://github.com/ShawnCC/web615_contactbook_frontend/tree/week10)

