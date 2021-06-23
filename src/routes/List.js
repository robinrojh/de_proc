import React from "react";
import { authService, dbService } from "../functions/util/fbase";
import Column from "../components/Column";

/**
 * This route is a details page for the to-do list selected in the dashboard.
 */
class List extends React.Component {
    /**
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            columnArray: [],
            columnId: "",
            errors: {}
        };
    }

    /**
     * Retrieves columns from firestore database given that the user is logged in
     */
    getMyColumns = () => {
        dbService.collection('users').doc(authService.currentUser.email)
            .collection('lists').doc(this.props.listId)
            .collection('columns').onSnapshot((snapshot) => {
                let value = 0;
                const arr = snapshot.docs.map((element) => {
                    return <Column key={value} title={element.data().title} description={element.data().description}
                        listId={this.props.listId} columnId={element.data().title} />
                });
                this.setState({
                    columnArray: arr
                })
            })
    }

    /**
     * React life cycle method to fetch firestore data before the page loads
     */
    componentDidMount = () => {
        this.getMyColumns();
    }

    /**
     * Handles the change in the form input
     * @param {Event} event form input change event
     */
    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    /**
     * Asynchronously handles the submission of the form
     * Adds another column to the dashboard
     * @param {Event} event form submission event
     */
    handleSubmit = async (event) => {
        event.preventDefault();
        const newWorkData = {
            title: this.state.title,
            description: this.state.description,
            owner: authService.currentUser.email,
        };
        // Adds a new document to the subcollection works in users.
        await dbService.collection('users').doc(authService.currentUser.email)
            .collection('lists').doc(this.props.listId)
            .collection('columns').doc(this.state.title).set(newWorkData)
        this.setState({
            title: "",
            description: "",
        });
    };

    render = () => {
        return (
            <>
                <h2>{this.props.listId}</h2>
                <form onSubmit={this.handleSubmit}>
                    <input
                        name="title"
                        placeholder="Title"
                        required
                        value={this.state.title}
                        onChange={this.handleChange}
                    ></input>
                    <input
                        name="description"
                        placeholder="Description"
                        required
                        value={this.state.description}
                        onChange={this.handleChange}
                    ></input>
                    <input type="submit" value="Add Your Column"></input>
                </form>
                {this.state.columnArray}
            </>
        )
    }
}

export default List;