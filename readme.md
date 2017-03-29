# Integrating Redux into a ReactJS App #

*Note: File is best viewed in a editor with markdown preview turned on*

Will start from where we left off last week, you can grab a copy of that code from here: [https://github.com/ShawnCC/web615_contactbook_frontend/tree/week8](https://github.com/ShawnCC/web615_contactbook_frontend/tree/week8
)

Be sure to install all depedencies for the application

* We will start by intalling redux and react-redux with the following command ``` npm i redux react-redux -D ```

* Will now create the store for our application in the app directory create a file called "reducers.js"
    * Add the following code to reducers.js
    ```
    import { combineReducers } from 'redux';

    const reducers = combineReducers({

    });

    export default reducers;
    ```

* We will now add the store and redux into our React app
    * Update app.js to the following:
    ```
    'use strict';

    // Include any necessary libraries
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { Provider } from 'react-redux'
    import { createStore, applyMiddleware } from 'redux'
    import createLogger from 'redux-logger';

    // Include root component
    import Index from './components/index';

    // Import main reducer
    import reducers from './reducers';

    // Take our reducers and run it through the createStore method, this is what we
    // will pass to the root component of our app
    // Also we can pass in middleware to our app, we are using the redux-logger
    // middleware to keep track of what actions are taking place in our app
    let store = createStore(reducers, applyMiddleware(createLogger()));

    // Render our root component to the provided element
    ReactDOM.render(
    // Wrap our application in the prodiver component, passing the store we created
    // to it. This will expose the store to all of our components
    <Provider store={ store }>
        <Index/>
    </Provider>, document.getElementById('app'));
    ```

* Now that we have redux set up in our application we will start creating reducers for our components

* We'll first create a reducer to populate the list component. In /app/components/contacts/ create a file called reducer.js. Populate the file with the following:
```
'use strict';

// Create some dummy data for our list, this will eventually be replaced with
// data from our API 
const defaultState = {
    contacts: [{
        id: 1,
        name: 'Contact 1',
        phone_number: '555 555 5555'
    },
    {
        id: 2,
        name: 'Contact 2',
        phone_number: '555 555 5555'
    },
    {
        id: 3,
        name: 'Contact 3',
        phone_number: '555 555 5555'
    }]
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
        default: {
            return state;
        }
    }
}

export default reducer
```
* Now will update our contacts component to get its state from the reducer, update the contacts component to the following:
```
'use strict';

import React from 'react';
import { connect } from 'react-redux';

import Contact from './contact/contact';

class Contacts extends React.Component {
    constructor() {
        super();
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
* The last step for the contacts component is to add our reducer to the combineReducers function
    * In /app/reducers.js import the contacts reducer with ``` import contactsReducer from './components/contacts/reducer'; ```
    * Add "contactsReducer" as a property in the object passed to combineReducers

* We'll now create a details component, and a reducer to populate it
    * In the components directory create a directory called "details" and inside of that the following files: index.js, and reducer.js
    * Open reducer.js and add the following:
    ```
    'use strict';

    const defaultState = {
        contact: {}
    };

    const reducer = (state = defaultState, action) => {
        switch (action.type) {
            // Since we want to update the state on the "SET_CONTACT" action, will
            // add a case to the switch to update the state on it
            //
            // ...state will update the state to the value of the current state,
            // from there we can update the individual properties. This must be done
            // since we must return an entirely new state every time
            case 'SET_CONTACT': {
                return {
                    ...state,
                    contact: action.payload.contact
                };
            }
            default: {
                return state;
            }
        }
    }

    export default reducer;
    ```
    * Now open index.js in details and add the following:
    ```
    'use strict';

    import React from 'react';
    import { connect } from 'react-redux'

    class Details extends React.Component {
        constructor() {
            super();
        }

        render() {
            const { reducer } = this.props;

            return (
                <div>
                    <p><strong>Name:</strong> { reducer.contact.name }</p>
                </div>
            );
        }
    }

    Details.propTypes = {
        reducer: React.PropTypes.object.isRequired
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
    * Finally we'll add the Details component into our Index component
        * Open up /app/components/index/index.js
        * Import details with ``` import Details from '../details'; ```
        * Add the Details component to the second column replacing "Contact Details" text

* Now we'll create click event on the contact component that will dispatch the "SET_CONTACT" event
    * Create a file called actions.js in /app/components/contacts/contact/, add the following to that file:
    ```
    'use strict';

    /**
    * The action for the "SET_CONTACT" event
    * Actions must always return an object, with two properties
    * 1. type - The name of the event to dispatch
    * 2. payload - The new data for the states for the reducers
    * Any logic for manipulating data ideally goes here, and not in your reducer
    */
    const setContact = (payload) => {
        return {
            type: 'SET_CONTACT',
            payload
        };
    };

    export {
        setContact
    };
    ```
    * Now we'll create a reducer for the Contact component, this will also listen for the "SET_CONTACT" event, and will store the ID of the contact in order for us to add an active state to the component
        * Create a reducer file in the /app/components/contacts/contact/ directory, and add the following to it
        ```
        'use strict';

        const defaultState = {
            contact: {}
        };

        const reducer = (state = defaultState, action) => {
            switch (action.type) {
                case 'SET_CONTACT': {
                    return {
                        contact: {
                            id: action.payload.contact.id
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
        * Now in /app/reducers.js will add that reducer
            * Will import it with ``` import contactReducer from './components/contacts/contact/reducer'; ```
            * And add the contactReducer to the combineReducers function
    * Now open up /app/components/contacts/contact/index.js and update it the following:
    ```
    'use strict';

    import React from 'react';
    import { connect } from 'react-redux';

    // Import the action(s)
    import { setContact } from './actions';

    class Contact extends React.Component {
        constructor() {
            super();

            // We must bind "this" from the class to the handleClick method, this
            // will allow us to grab props, context, and whatever other properties
            // of the parent class we need
            this.handleClick = this.handleClick.bind(this);
        }

        /**
        * Handle the click event
        * @param {Object} e - Event object
        */
        handleClick(e) {
            e.preventDefault();

            // Grab the contact from props
            const { contact } = this.props;

            // Dispatch the action, passing the contact to the action
            this.context.store.dispatch(setContact({
                contact
            }));
        }

        render() {
            // Grab the contact property from the props object which is provided by
            // the parent component. Google "Object destructuring" if you are
            // unfamilair with this syntax
            const { contact, reducer } = this.props;

            let cssClasses = 'list-group-item';

            if (contact.id === reducer.contact.id) {
                cssClasses += ' active';
            }
            
            /**
            * Print out the properties of the contact to the list item
            */
            return (
                <a href="#" className={ cssClasses } onClick={ this.handleClick }>{ contact.name } - { contact.phone_number }</a>
            );
        }
    }

    Contact.propTypes = {
        contact: React.PropTypes.object.isRequired
    };

    Contact.contextTypes = {
        store: React.PropTypes.object
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
    * We should now be able to launch our app with ``` npm run server ``` and see the list of contacts, and be able to click one to update the details component, and see the active state on the list-item we've clicked

Completed code is available at: [https://github.com/ShawnCC/web615_contactbook_frontend/tree/week9](https://github.com/ShawnCC/web615_contactbook_frontend/tree/week9)