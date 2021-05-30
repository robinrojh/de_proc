import React from "react";
import axios from "axios";
import { authService } from "../functions/util/fbase";

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
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    try {
      await authService.signInWithEmailAndPassword(this.state.email, this.state.password);
    }
    catch (error) {

    }
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
