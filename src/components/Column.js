import React from 'react'
import { authService, dbService } from '../functions/util/fbase';
import ListEvent from './ListEvent';

class Column extends React.Component {
    constructor(props) {
        super(props);
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
        dbService.collection('users').doc(authService.currentUser.email)
        .collection('lists').doc(this.props.listId)
        .collection('columns').doc(this.props.columnId)
        .collection('works').onSnapshot((snapshot) => {
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
            .collection('columns').doc(this.props.columnId)
            .collection('works').doc(this.state.title).set(newWorkData)
        this.setState({
            title: "",
            description: "",
        });
    };

    /**
     * Handles the change in the form during editing process
     * @param {Event} event refers to the change in the event editing form inputs
     */
    handleEditChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    /**
     * Handles the edit button clicks. Changes isEditing state to true
     * @param {Event} event button clicking event for editing
     */
    onEditClick = (event) => {
        event.preventDefault();
        this.setState({
            isEditing: true
        })
    }

    /**
     * Handles the cancel edit button clicks. Terminates editing by setting
     * isEditing to false
     * @param {Event} event button clicking event for canceling
     */
    onCancelClick = (event) => {
        event.preventDefault();
        this.setState({
            isEditing: false
        })
    }

    /**
     * Asynchronously handles the submission of the editing form. Updates the
     * existing values of the selected work.
     * @param {Event} event submission event for input form
     */
    handleEditSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection('users').doc(authService.currentUser.email)
        .collection('lists').doc(this.props.listId)
        .collection('columns').doc(this.props.columnId).update({
            title: this.state.newTitle,
            description: this.state.newDescription
        })
        this.setState({
            isEditing: false
        })
    }

    /**
     * Deletes the selected work after getting a confirmation from the user
     * using window.confirm method
     * @param {Event} event button clicking event for deletion
     */
    handleDeleteClick = async (event) => {
        event.preventDefault();
        let ok;
        ok = window.confirm("Are you sure you want to delete this work?");
        if (ok) {
            await dbService.collection('users').doc(authService.currentUser.email).collection('lists').doc(this.props.listId).collection('columns').doc(this.props.columnId).delete();
        }
    }

    render = () => {
        let key = 0;
        return (
            <>
                <h3>{this.props.columnId}</h3>
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
                    <input type="submit" value="Add Your Work"></input>
                </form>
                <div>
                    {this.state.eventArray.map((element) => {
                        key++;
                        console.log(element.data())
                        return <ListEvent key={key} title={element.data().title} description={element.data().description} listId={this.props.listId} workId={element.id} />
                    })}
                </div>
            </>
        )
    }
}

export default Column;