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