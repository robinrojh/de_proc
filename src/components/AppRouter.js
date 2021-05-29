import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../routes/Home";
import About from "../routes/About";
import Lists from "../routes/List";
import SignIn from "../routes/SignIn";
import SignUp from "../routes/SignUp";
import AuthRoute from "../util/AuthRoute";

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/lists" component={Lists} />
        <AuthRoute exact path="/SignIn" component={SignIn} />
        <AuthRoute exact path="/SignUp" component={SignUp} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
