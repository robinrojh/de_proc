import React from "react";
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

  /**
   * Handles the change in the sign in form input
   * @param {event} event refers to the change of state from the input form
  */ 
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Handles the submission of the sign in form
   * @param {Event} event refers to the event of submission of the form
  */ 
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
