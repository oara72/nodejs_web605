'use strict';

import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from '../header';
import Messages from '../messages';
import Contacts from '../contacts';
import Details from '../details';
import Update from '../update';
import Create from '../create';

export default class Index extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <BrowserRouter>
            <div className="container"> {/* Create our root element */}
                {/* Include self closing header element */}
                <Header/>
                <Messages/>
                <div className="row">
                    <div className="col-xs-4">
                        <Contacts/>
                    </div>
                    <div className="col-xs-8">
                        <Route exact path="/contacts/create/" component={ Create }/>
                        <Route exact path="/contacts/:contactId/details" component={ Details }/>
                        <Route exact path="/contacts/:contactId/update/" component={ Update }/>
                    </div>
                </div>
            </div>
            </BrowserRouter>
        );
    }
}