import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Home from "../routes/Home";
import About from "../routes/About";
import SignIn from "../routes/SignIn";
import SignUp from "../routes/SignUp";
import Dashboard from "../routes/Dashboard";
import Navbar from "./Navbar";
import theme from "../functions/util/theme";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import ListDisplay from "./ListDisplay";

const muitheme = createMuiTheme(theme);

const AppRouter = ({ isLoggedIn }) => {
  // Provides a basic router for all the paths in the website.
  return (
    <>
      <MuiThemeProvider theme={muitheme}>
        <Router>
          <Navbar authenticated={isLoggedIn} />
          <div className="container">
            <Switch>
              {isLoggedIn ? (
                <>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/about" component={About} />
                  <Route exact path="/dashboard" component={Dashboard} />
                  <Route
                    exact
                    path="/lists/:listTitle"
                    component={ListDisplay}
                  />
                  <Redirect to="/dashboard"></Redirect>
                </>
              ) : (
                <>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/about" component={About} />
                  <Route exact path="/signin" component={SignIn} />
                  <Route exact path="/signup" component={SignUp} />
                  <Route
                    exact
                    path="/lists/:listTitle"
                    component={ListDisplay}
                  />
                  {/* <Route exact path="/list" component={List} /> */}
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
