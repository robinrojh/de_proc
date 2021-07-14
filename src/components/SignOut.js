import React from "react";
import { authService } from "../functions/util/fbase";

class SignOut extends React.Component {
  /**
   * Handles sign out when div is clicked
   * Redirects to the default page once signed out
   */
  signOutHandler = () => {
    authService.signOut();
    this.props.history.push("/");
    localStorage.authenticated = false;
  };

  render = () => {
    return <div onClick={this.signOutHandler}>Sign Out</div>;
  };
}

export default SignOut;
