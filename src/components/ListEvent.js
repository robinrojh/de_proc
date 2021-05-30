import React from 'react';

class ListEvent extends React.Component {
    constructor(props) {
        super();
    }

    render = () => {
        return (
            <>
                Title: {this.props.title} <br />
                Description: {this.props.description} <br />
            </>
        )
    }
}

export default ListEvent;