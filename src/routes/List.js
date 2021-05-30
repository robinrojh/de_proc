import React from "react";
import axios from "axios";
import { authService } from "../functions/util/fbase";

class List extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            description: "",
            errors: {},
        };
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        const newWorkData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            nickname: this.state.nickname,
        };

        axios
            .post("/work", newWorkData)
            .then((res) => {
                this.setState({
                    loading: false,
                    errors: null,
                    authenticated: true,
                });
            })
            .catch((err) => {
                this.setState({
                    errors: err.response.data,
                    loading: false,
                });
            });
    };

    render = () => {
        return (
            <div>
                {console.log("list active")}
                {console.log(authService.currentUser)}
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
            </div>
        )
    }
}

export default List;