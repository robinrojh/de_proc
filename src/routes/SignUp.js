import React from "react";
import { authService, dbService } from "../functions/util/fbase";

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

  /**
   * Handles the change in the sign up form input
   * @param {event} event refers to the change of state from the input form
  */
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Handles the submission of the sign up form
   * @param {Event} event refers to the event of submission of the form
  */
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    try {
      await authService.createUserWithEmailAndPassword(this.state.email, this.state.password);
      const userObj = {
        email: this.state.email,
        nickname: this.state.nickname
      }
      await dbService.collection('users').doc(this.state.email).set(userObj);
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
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          value={this.state.confirmPassword}
          onChange={this.handleChange}
        ></input>
        <input
          name="nickname"
          placeholder="Nickname"
          required
          value={this.state.nickname}
          onChange={this.handleChange}
        ></input>
        <input type="submit" value="Create Account"></input>
      </form>
    );
  };
}
export default SignUp;
