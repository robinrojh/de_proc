import React from "react";
import axios from 'axios';

class SignUp extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            nickname: "",
            errors: {},
        };
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            nickname: this.state.handle,
        };
        axios
            .post("/signup", newUserData)
            .then((res) => {
                this.setAuthorizationHeader(res.data.token);
                this.setState({
                    loading: false,
                    errors: null,
                });
                this.props.history.push("/List");
            })
            .catch((err) => {
                this.setState({
                    errors: err.response.data,
                    loading: false,
                });
            });
    };

    handleChange = (event) => {
        event.preventDefault();
        const { target:
            { name, value }
        } = event;
        if (name === "email") {
            this.setState({
                email: value
            });
        }
        else if (name === "password") {
            this.setState({
                password: value
            });
        }
        else if (name === "nickname") {
            this.setState({
                nickname: value
            })
        }
    }
    setAuthorizationHeader = (token) => {
        const FBIdToken = `Bearer ${token}`;
        localStorage.setItem("FBIdToken", FBIdToken);
        axios.defaults.headers.common["Authorization"] = FBIdToken;
    };

    render = () => {
        return (
            <form onSubmit={this.handleSubmit}>
                <input name="email" type="email" placeholder="Email" required value={this.state.email} onChange={this.handleChange}></input>
                <input name="password" type="password" placeholder="Password" required value={this.state.password} onChange={this.handleChange}></input>
                <input name="nickname" placeholder="Nickname" required value={this.state.nickname} onChange={this.handleChange}></input>
                <input type="submit" value="Create Account"></input>
            </form>
        )
    };
}
export default SignUp;
