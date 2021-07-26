import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Home from "../routes/Home";
import SignIn from "../routes/SignIn";
import SignUp from "../routes/SignUp";
import Dashboard from "../routes/Dashboard";
import Notification from "../routes/Notification";
import Navbar from "./Navbar";
import theme from "../functions/util/theme";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import ListDisplay from "./ListDisplay";
import { useEffect } from "react";
import { authService, dbService } from "../functions/util/fbase";

const cron = require("cron");
const muitheme = createMuiTheme(theme);

const AppRouter = ({ isLoggedIn }) => {
  // Provides a basic router for all the paths in the website.
  localStorage.authenticated = true;
  useEffect(() => {

  }, []);

  return (
    <>
      <MuiThemeProvider theme={muitheme}>
        <Router>
          <Navbar authenticated={isLoggedIn} />
          <div className="container">
            <Switch>
              {authService.currentUser ? (
                <>
                  <Route exact path="/" />
                  <Route exact path="/dashboard" component={Dashboard} />
                  <Route
                    exact
                    path="/lists/:listTitle"
                    component={ListDisplay}
                  />
                  <Route exact path="/notification" component={Notification} />
                  {/* <Redirect to="/dashboard"></Redirect> */}
                </>
              ) : (
                <>
                  <Route exact path="/" />
                  <Route exact path="/signin" component={SignIn} />
                  <Route exact path="/signup" component={SignUp} />
                  <Redirect to="/signin" exact></Redirect>
                </>
              )}
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    </>
  );
};

export default AppRouter;
