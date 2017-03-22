'use strict';

import React from 'react';
import Header from '../header/header';
import Contacts from '../contacts/contacts';
import Details from '../details';



export default class Index extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="container">
                {/*<p>Index Component</p>*/}
                <Header/> 

            <div className="row">
    <div className="col-xs-4">
        {/* Include self closing contacts element */}
        <Contacts/>
    </div>
    <div className="col-xs-8">
        {/*Contact Details*/}
        <Details/>
    </div>
</div>

            </div>     
        );
    }
}