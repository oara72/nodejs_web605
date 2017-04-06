# Integrating Sockets - assignment 9 #

*Note: File is best viewed in a editor with markdown preview turned on*

Will start from where we left off last week, you can grab a copy of that code from here: https://github.com/ShawnCC/web615_contactbook_frontend/tree/week11

Be sure to install all depedencies for the application

Also you'll want to grab a copy of the backend code, all of our data will be coming from that now, we'll use the Week4_No_Auth branch from here: https://github.com/ShawnCC/web615_contactbook_backend/tree/week4_no_auth.

* We'll start by installing the new NPM package we'll need, run ``` npm i socket.io-client -D ```

* Next create a new directory in the /app/ directory called "reducers", we'll be creating a shared reducer for sockets here
    * In that directory create a file called "socket.reducer.js"
    * In the new file add the following code:
    ```
    'use strict';

    const defaultState = {
        socket: require('socket.io-client')('http://localhost:3001')
    };

    const reducer = (state = defaultState, action) => {
        switch (action.type) {
            default: {
                return state;
            }
        }
    }

    export default reducer;
    ```
    * Next open up /app/reducers.js and add the following import statement ``` import socketReducer from './reducers/socket.reducer'; ``` after the already existing imports
        * Now add "socketReducer" to the combineReduers function

* Next open up /app/components/contacts/index.js
    * Add "socketReducer: state.socketReducer" to the mapStateToProps function, it should now look like:
    ```
    /**
    * This will set up the various reducers as props in our component
    * @param {Object} state - The store for our application, contains all reducers
    */
    function mapStateToProps(state) {
        return {
            reducer: state.contactsReducer,
            socketReducer: state.socketReducer
        };
    }
    ```
    * Next create a method called initSocketEvents to the class, the method should look like:
    ```
    /**
     * Setup listeners for sockets
     */
    initSocketEvents() {
        const { socketReducer } = this.props;
        const { socket } = socketReducer;

        socket.on('PUT/api/v1/contacts/:contactId/', ()=> {
            this.getContacts();
        });
    }
    ```
    * Now call initSocketEvents to the componentWillMount method, componentWillMount should now look like:
    ```
    /**
     * Method built into React.Component, this is called right before the
     * component renders for the first time
     */
    componentWillMount() {
        this.getContacts();
        this.initSocketEvents();
    }
    ```
    * With all that in place, we should be able to open two browser windows, update a contact in one, and see the change also happen in the other

* Next open up /app/components/details/index.js
    * Add "socketReducer: state.socketReducer" to the mapStateToProps function, it should now look like:
    ```
    /**
    * This will set up the various reducers as props in our component
    * @param {Object} state - The store for our application, contains all reducers
    */
    function mapStateToProps(state) {
        return {
            reducer: state.contactsReducer,
            socketReducer: state.socketReducer
        };
    }
    ```
    * Next create a method called initSocketEvents to the class, the method should look like:
    ```
    /**
     * Setup listeners for sockets
     */
    initSocketEvents() {
        const { socketReducer } = this.props;
        const { socket } = socketReducer;

        socket.on('PUT/api/v1/contacts/:contactId/', (payload) => {
            const contactId = this.props.match.params.contactId;

            if (payload.contactId.toString() === contactId.toString()) {
                this.context.store.dispatch(getContact(contactId));
            }
        });
    }
    ```
    * Now call initSocketEvents to the componentWillMount method, componentWillMount should now look like:
    ```
    /**
     * Method built into React.Component, this is called right before the
     * component renders for the first time
     */
    componentWillMount() {
        this.getContacts();
        this.initSocketEvents();
    }
    ```
    * Once again with all that in place, we should be able to open two browser windows, navigate to the same contact in both, update a contact in one, and see the change also happen in the other

Completed code is available at: https://github.com/ShawnCC/web615_contactbook_frontend/tree/week12
