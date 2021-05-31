import React from "react";
import { authService, dbService } from "../functions/util/fbase";
import ListEvent from "../components/ListEvent";
import SignOut from "../components/SignOut";

/**
 * This route is a details page for the to-do list selected in the dashboard.
 */
class List extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            description: "",
            eventArray: [],
            eventId: "",
            errors: {}
        };
    }

    /**
     * Retrieves work from firestore database given that the user is logged in
     */
    getMyWorks = () => {
        dbService.collection('users').doc(authService.currentUser.email).collection('works').onSnapshot((snapshot) => {
            const arr = snapshot.docs;
            this.setState({
                eventArray: arr
            })
        })
    }

    /**
     * React life cycle method to fetch firestore data before the page loads
     */
    componentDidMount = () => {
        this.getMyWorks();
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
     * @param {Event} event form submission event
     */    handleSubmit = async (event) => {
        event.preventDefault();
        const newWorkData = {
            title: this.state.title,
            description: this.state.description,
            owner: authService.currentUser.email,
        };
        // Adds a new document to the subcollection works in users. Note: this will change based on the new database structure
        await dbService.collection('users').doc(authService.currentUser.email).collection('works').add(newWorkData)
        this.setState({
            title: "",
            description: "",
        });
    };

    render = () => {
        let key = 0;
        return (
            <div>
                <SignOut/>
                <h2>To-do List!</h2>
                <form onSubmit={this.handleSubmit}>
                    <input
                        name="title"
                        placeholder="Title"
                        required
                        value={this.state.email}
                        onChange={this.handleChange}
                    ></input>
                    <input
                        name="description"
                        placeholder="Description"
                        required
                        value={this.state.nickname}
                        onChange={this.handleChange}
                    ></input>
                    <input type="submit" value="Add Your Work!"></input>
                </form>
                {this.state.eventArray.map((element) => {
                    key++;
                    return <ListEvent key={key} title={element.data().title} description={element.data().description} workId={element.id} />
                })}
            </div>
        )
    }
}

export default List;