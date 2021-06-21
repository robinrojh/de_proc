import React from 'react';
import { authService, dbService } from '../functions/util/fbase';

/**
 * This component contains details about a work.
 */
class Work extends React.Component {
    /**
     * 
     * @param {Number, String, String, String, String, String} props contains 
     * key, title, description, listId, columnId, workId, respectively.
     */
    constructor(props) {
        super(props);
        this.state = {
            newTitle: "",
            newDescription: "",
            isEditing: false
        }
    }

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
            .collection('works').doc(this.props.workId).update({
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
            await dbService.collection('users').doc(authService.currentUser.email)
                .collection('works').doc(this.props.workId).delete();
        }
    }

    render = () => {
        return (
            <>
                Title: {this.props.title} <br />
                Description: {this.props.description} <br />
                {/* Checks if the user is editing an event.
                Display editing form if the user is editing. */}
                {this.state.isEditing ?
                    <>
                        <form onSubmit={this.handleEditSubmit}>
                            <input
                                name="newTitle"
                                placeholder="New title"
                                required
                                value={this.state.newTitle}
                                onChange={this.handleEditChange}
                            ></input>
                            <input
                                name="newDescription"
                                placeholder="New description"
                                required
                                value={this.state.newDescription}
                                onChange={this.handleEditChange}
                            ></input>
                            <input type="submit" value="Change your work!"></input>
                        </form>
                        <button onClick={this.onCancelClick}> Cancel Edit </button>
                    </>
                    :
                    <button onClick={this.onEditClick}> Edit event </button>
                }
                <button onClick={this.handleDeleteClick}> Delete event </button> <br />
            </>
        )
    }
}

export default Work;