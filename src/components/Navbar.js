import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import MyButton from "../functions/util/MyButton";
import axios from "axios";
import { authService } from "../functions/util/fbase";

//MUI stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import ListIcon from "@material-ui/icons/List";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import NotificationsIcon from "@material-ui/icons/Notifications";

class Navbar extends Component {
  state = {
    authenticated: false,
  };

  /**
   * Signs out the user from the database.
   */
  handleLogout = () => {
    console.log("logout");
    authService.signOut();
    this.setState({
      authenticated: false,
    });
  };

  /**
   * when the component mounts, checks if the user is authenticated by
   * checking if the user is logged in.
   */
  componentDidMount() {
    this.setState({
      authenticated: authService.currentUser,
    });
  }
  render() {
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authService.currentUser ? (
            <Fragment>
              <Link to="/Dashboard">
                <MyButton tip="List">
                  <ListIcon color="primary" />
                </MyButton>
              </Link>
              <Link to="/Notification">
                <MyButton tip="Notifications">
                  <NotificationsIcon color="primary" />
                </MyButton>
              </Link>
              <Link to="/SignIn">
                <MyButton tip="Logout" onClick={this.handleLogout}>
                  <ExitToAppIcon color="primary" />
                </MyButton>
              </Link>
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/SignIn">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/SignUp">
                {" "}
                Signup
              </Button>
              {/* <Button color="inherit" component={Link} to="/">
                {" "}
                Home
              </Button> */}
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default Navbar;
