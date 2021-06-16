import React from "react";
import { authService, dbService } from "../functions/util/fbase";
import SignOut from "../components/SignOut";
import List from "./List";

class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            description: "",
            listArray: [],
            eventId: "",
            errors: {}
        };
    }

    /**
     * Retrieves to-do lists from firestore database given that the user is logged in
     */
    getMyLists = () => {
        dbService.collection('users').doc(authService.currentUser.email).collection('lists').onSnapshot((snapshot) => {
            var value = 0;
            const arr = snapshot.docs.map((element) => {
                value++;
                return <List key={value} listTitle={element.data().title} />
            })
            this.setState({
                listArray: arr
            })
        })
    }

    /**
     * React life cycle method to fetch firestore data before the page loads
     */
    componentDidMount = () => {
        this.getMyLists();
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
     */
    handleSubmit = async (event) => {
        event.preventDefault();
        const newWorkData = {
            title: this.state.title,
            description: this.state.description,
            owner: authService.currentUser.email,
        };
        // Adds a new document to the subcollection works in users. Note: this will change based on the new database structure
        await dbService.collection('users').doc(authService.currentUser.email).collection('lists').doc(this.state.title).set(newWorkData)
        this.setState({
            title: "",
            description: "",
        });
    };

    render = () => {
        return (
            <>
                <SignOut />
                <h1>Make your to-do list here</h1>
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
                    <input type="submit" value="Make a New List"></input>
                </form>
                {this.state.listArray}
            </>
        )
    }
}

export default Dashboard;