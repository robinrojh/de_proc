import React from "react";
import axios from "axios";
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
    // const newUserData = {
    //   email: this.state.email,
    //   password: this.state.password,
    //   confirmPassword: this.state.confirmPassword,
    //   nickname: this.state.nickname,
    // };
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
    // axios
    //   .post("/signup", newUserData)
    //   .then((res) => {
    //     this.setAuthorizationHeader(res.data.token);
    //     this.setState({
    //       loading: false,
    //       errors: null,
    //       authenticated: true,
    //     });
    //     this.props.history.push("/");
    //   })
    //   .catch((err) => {
    //     this.setState({
    //       errors: err.response.data,
    //       loading: false,
    //     });
    //   });
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
