import React, { Component } from "react";
import axios from "axios";
// function SignUp(props) {
//     return (
//         <div>
//             SignUp Page!
//         </div>
//     )
// }

// export default SignUp;

class SignUp extends Component {
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
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      nickname: this.state.handle,
      authenticated: true,
    };
    axios
      .post("/signup", newUserData)
      .then((res) => {
        setAuthorizationHeader(res.data.token);
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

  setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authorization"] = FBIdToken;
  };
}
export default SignUp;
