import React, { Component } from "react";

// function SignIn(props) {
//     return (
//         <div>
//             SignIn Page!
//         </div>
//     )
// }

// export default SignIn;

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false,
      errors: {},
    };
  }
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
      .post("/SignIn", userData)
      .then((res) => {
        setAuthorizationHeader(res.data.token);
        this.setState({
          loading: false,
          authenticated: true,
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
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authorization"] = FBIdToken;
  };
}

export default SignIn;
