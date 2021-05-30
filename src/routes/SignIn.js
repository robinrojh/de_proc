import React from "react";
import axios from "axios";

class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false,
      errors: {},
    };
  }

  // Handles the change in the form input
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // Handles submission of the form
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    axios
      .post("/login", userData)
      .then((res) => {
        this.setAuthorizationHeader(res.data.token);
        this.setState({
          loading: false,
          authenticated: true,
        });
        this.props.history.push("/list");
      })
      .catch((err) => {
        this.setState({
          errors: err.response.data,
          loading: false,
        });
      });
  };

  setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authorization"] = FBIdToken;
  };
  render = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={this.state.email}
          onChange={this.handleChange}
        ></input>
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={this.state.password}
          onChange={this.handleChange}
        ></input>
        <input type="submit" value="Sign In"></input>
      </form>
    );
  };
}

export default SignIn;
