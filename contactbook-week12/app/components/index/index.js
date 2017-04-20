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
            <BrowserRouter>{/* Wrap our root component in the BrowserRouter component provided by react-router-dom, this opens up functionality to the rest of our app */}
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
                            {/*
                                We can display individual components based on
                                the URL by placing <Route> components in our app,
                                when a user navigates to the specified path, the
                                specified component is rendered in place of the
                                <Route> component
                                The "exact" attribute forces the route to be exactly
                                as it is in the path attribute, if we did not
                                specifiy exact Details would be displayed on both
                                the Details path and the Update path
                                :attribute in the URL declares that segment of the URL is dynamic,
                                we can access that segment in the URL via props
                            */}
                            <Route exact path="/contacts/:contactId/" component={ Details }/>
                            <Route exact path="/contacts/:contactId/update/" component={ Update }/>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}