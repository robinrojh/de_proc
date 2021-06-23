import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import MyButton from "../util/MyButton";
import axios from "axios";

//MUI stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import ListIcon from "@material-ui/icons/List";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import NotificationsIcon from "@material-ui/icons/Notifications";

class Navbar extends Component {
  state = {
    authenticated: localStorage.FBIdToken,
  };
  handleLogout = () => {
    console.log("logout");
    localStorage.removeItem("FBIdToken");
    delete axios.defaults.headers.common["Authorization"];
    this.setState({
      authenticated: false,
    });
    // this.props.history.push("/SignIn");
  };
  render() {
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {this.state.authenticated ? (
            <Fragment>
              <Link to="List">
                <MyButton tip="List">
                  <ListIcon color="primary" />
                </MyButton>
              </Link>
              <Link to="/">
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
              <Button color="inherit" component={Link} to="/">
                {" "}
                Home
              </Button>
              <Button color="inherit" component={Link} to="/List">
                {" "}
                List
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default Navbar;
