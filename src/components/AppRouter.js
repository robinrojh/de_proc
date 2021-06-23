import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Home from "../routes/Home";
import About from "../routes/About";
import SignIn from "../routes/SignIn";
import SignUp from "../routes/SignUp";
import Dashboard from "../routes/Dashboard";

const AppRouter = ({ isLoggedIn }) => {
  // Provides a basic router for all the paths in the website.
  return (
    <>
      <Router>
        <Switch>
          {isLoggedIn ?
            <>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Redirect to="/dashboard"></Redirect>
            </>
            :
            <>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route exact path="/signin" component={SignIn} />
              <Route exact path="/signup" component={SignUp} />
              {/* <Route exact path="/list" component={List} /> */}
            </>

          }
        </Switch>
      </Router>
    </>
  );
};

export default AppRouter;
