import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../routes/Home";
import About from "../routes/About";
import List from "../routes/List";
import SignIn from "../routes/SignIn";
import SignUp from "../routes/SignUp";
import AuthRoute from "../util/AuthRoute";
import { authService } from "../functions/util/fbase"

const AppRouter = ({ isLoggedIn }) => {
  // Provides a basic router for all the paths in the website.
  return (
    <>
      <Router>
        <Switch>
          {isLoggedIn ?
            <>
              {console.log("logged in")}
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route exact path="/list" component={List} />
            </>
            :
            <>
              {console.log("not logged in")}
              {console.log(authService.currentUser)}
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <AuthRoute exact path="/signin" authenticated={isLoggedIn} component={SignIn} />
              <AuthRoute exact path="/signup" authenticated={isLoggedIn} component={SignUp} />
              {/* <Route exact path="/list" component={List} /> */}

            </>

          }
        </Switch>
      </Router>
    </>
  );
};

export default AppRouter;
