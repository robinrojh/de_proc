import React from "react";
import axios from "axios";
import { authService, dbService } from "../functions/util/fbase";
import ListEvent from "../components/ListEvent";

class List extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            description: "",
            eventArray: [],
            errors: {},
        };
    }

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
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    // handles the addition of new work into the database
    handleSubmit = async (event) => {
        event.preventDefault();
        const newWorkData = {
            title: this.state.title,
            description: this.state.description,
            owner: authService.currentUser.email
        };

        await dbService.collection('users').doc(authService.currentUser.email).collection('works').add(newWorkData)
        this.setState({
            title: "",
            description: ""
        });
        // axios
        //     .post("/work", newWorkData)
        //     .then((res) => {
        //         this.setState({
        //             loading: false,
        //             errors: null,
        //             authenticated: true,
        //         });
        //     })
        //     .catch((err) => {
        //         this.setState({
        //             errors: err.response.data,
        //             loading: false,
        //         });
        //     });
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
                    console.log(element.data());
                    return <ListEvent key={key} title={element.data().title} description={element.data().description} />
                })}
            </div>
        )
    }
}

export default List;