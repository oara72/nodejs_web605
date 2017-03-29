# WEB615 Client Side Skeleton

download this package [https://github.com/ShawnCC/web615_client_side_skeleton](https://github.com/ShawnCC/web615_client_side_skeleton)

This have:

app file

# Creating a Basic React Application #

*Note: File is best viewed in a editor with markdown preview turned on*

You'll want to grab a copy of the Client Side [Skeleton](https://github.com/ShawnCC/web615_client_side_skeleton) which has the base for our application, including the build process

Be sure to install all depedencies for the application

* First we'll launch our application with ``` npm run server ```, we are using Webpack and its Webpack Dev Server so our browser will auto refresh as we make changes, navigate to http://localhost:8080/ to see our application
    * Our application now should just be a paragraph saying "Index Component", this is coming from index/index.js, which is read in by app/app.js.
    * App/app.js is the root of our application, this file includes our base component and connects it to the DOM with the render method

* Now we'll create our first component, the application header
    * In the app directory create a new directory called "header" and a file called "header.js" inside of that
    * Inside that file include the following code:
    ```
    'use strict';

    import React from 'react';

    export default class Header extends React.Component {
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
                <header>{/* Create our root element for the component */}
                    <h1>WEB615 Contact Book App</h1>{/* Create title for our app */}
                </header>
            );
        }
    }
    ```

* Now we'll include our new header component into our application
    * Go to the index.js file in app/index/
    * In that file under the import React statement add the following 
    ```
    import Header from '../header/header';
    ```
    Now in the render method replace the paragraph with
    ```
    <Header/>
    ```
    * If we go back to the browser we should see our header component rendered on the the page

* Now we'll create a components to show a list of our contacts
    * In the app directory create a new directory called "contacts"
    * Inside that directory create two files, one called contacts.js and one called contact.js
    * Open up contacts.js. This file will be the list of all the contacts
    * Inside contacts.js add the following code:
    ```
    'use strict';

    import React from 'react';

    import Contact from './contact';

    export default class Contacts extends React.Component {
        constructor() {
            super();

            // Create some dummy contacts inside the constructor so we can populate
            // child elements
            this.contacts = [
                {
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
                }
            ];
        }

        render() {
            // Loop through all of the contacts that were created in the constructor
            // and create a <Contact> component for each of them. We pass the data
            // for the contact through the contact attribute, as well as pass the
            // contact ID to the key attribute
            // Note: The key attribute must be unique for each component, so
            // something that will be unique like an ID works best
            let listItems = this.contacts.map((contact) => {
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
    ```
    * Now we'll have to create a component to house each individual contact, we'll do that in contact.js
    * In contact.js add the following code:
    ```
    'use strict';

    import React from 'react';

    export default class Contact extends React.Component {
        constructor() {
            super();
        }

        render() {
            // Grab the contact property from the props object which is provided by
            // the parent component. Google "Object destructuring" if you are
            // unfamilair with this syntax
            const { contact } = this.props;
            
            /**
            * Print out the properties of the contact to the list item
            */
            return (
                <a href="#" className="list-group-item">{ contact.name } - { contact.phone_number }</a>
            );
        }
    }
    ```

* Now we'll include our contacts componet into the index of our application
    * Open up index/index.js
    * Under the header import statement, add an import for the contacts component
    ```
    import Contacts from '../contacts/contacts';
    ```
    * Now in the render method under our header component add the markup for our contacts list, and some placeholder markup for the future
    ```
    <div className="row">
        <div className="col-xs-4">
            {/* Include self closing contacts element */}
            <Contacts/>
        </div>
        <div className="col-xs-8">
            Contact Details
        </div>
    </div>
    ```

* In the browser we should now see our three contacts rendered into a list

* The core of any ReactJS app is creating components, nesting them, passing props to child components, and reading those props. So be sure that you understand those basic principals.

Completed code is available at: [https://github.com/ShawnCC/web615_contactbook_frontend/tree/week8](https://github.com/ShawnCC/web615_contactbook_frontend/tree/week8)