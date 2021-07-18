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
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .get()
      .then((listQuerySnapshot) => {
        listQuerySnapshot.docs.forEach((listDoc) => {
          dbService
            .collection("users")
            .doc(authService.currentUser.email)
            .collection("lists")
            .doc(listDoc.data().title)
            .collection("columns")
            .get()
            .then((columnQuerySnapshot) => {
              columnQuerySnapshot.docs.forEach((columnDoc) => {
                dbService
                  .collection("users")
                  .doc(authService.currentUser.email)
                  .collection("lists")
                  .doc(listDoc.data().title)
                  .collection("columns")
                  .doc(columnDoc.data().title)
                  .collection("works")
                  .get()
                  .then((workQuerySnapshot) => {
                    workQuerySnapshot.docs.forEach((workDoc) => {
                      const dueDate = new Date(workDoc.data().dueDate);
                      const notificationTiming = workDoc.data().notification;
                      dueDate.setMinutes(
                        dueDate.getMinutes() - notificationTiming
                      );
                      if (dueDate > new Date() && !workDoc.data().completed) {
                        new cron.CronJob(dueDate, () => {
                          const notification = {
                            content:
                              "Notification for " + workDoc.data().description,
                          };
                          dbService
                            .collection("users")
                            .doc(authService.currentUser.email)
                            .collection("notification")
                            .add(notification);
                          new Notification(
                            "notification for " + workDoc.data().description
                          );
                          console.log(
                            "notification fired for the work: " +
                              workDoc.data().description
                          );
                        }).start();
                      }
                    });
                  });
              });
            });
        });
      });
  }, []);

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
                  <Route exact path="/notification" component={Notification} />
                  {/* <Redirect to="/dashboard"></Redirect> */}
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
