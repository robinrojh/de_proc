import React from "react";
import { authService, dbService } from "../functions/util/fbase";
import ListEvent from "../components/ListEvent";

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

    componentDidMount = () => {
        this.getMyWorks();
    }

    // handles the change in state from the work input form
    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    // handles the addition of new work into the database
    handleSubmit = async (event) => {
        event.preventDefault();
        // Finds out the document id of the work that will be added next
        const newWorkData = {
            title: this.state.title,
            description: this.state.description,
            owner: authService.currentUser.email,
        };
        // Adds a new document to the subcollection works in users.
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