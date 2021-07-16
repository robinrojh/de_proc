import React, { Component } from "react";
import { authService, dbService } from "../functions/util/fbase";

import Grid from "@material-ui/core/Grid";

import withStyles from "@material-ui/core/styles/withStyles";

import { Link } from "react-router-dom";

import MuiLink from "@material-ui/core/Link";
import AddList from "../components/AddList";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const cron = require("cron");

const styles = (theme) => ({
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  root: {
    flexGrow: 1,
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px",
    },
  },
});
class Dashboard extends Component {
  state = {
    title: "",
    description: "",
    listArray: [],
    eventId: "",
    errors: {},
  };

  listAdd = (listName) => {
    const newLists = this.state.listArray;
    newLists.push(listName);
    this.setState({
      listArray: newLists,
    });
  };

  /**
   * Retrives all the lists from a user's profile in firestore
   */
  getMyLists = () => {
    const { classes } = this.props;
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .onSnapshot((element) => {
        const lists = [];
        element.docs.forEach((list) => {
          lists.push(list.data());
        });
        const componentList = lists.map((element) => {
          return (
            <Grid item xs={12} key={element.title}>
              <Card className={classes.card}>
                <CardContent className={classes.content}>
                  <MuiLink
                    component={Link}
                    to={`/lists/${element.title}`}
                    color="primary"
                    variant="h5"
                  >
                    {element.title}
                    <hr />
                  </MuiLink>
                </CardContent>
              </Card>
            </Grid>
          );
        })
        this.setState({
          listArray: componentList
        });
      })
  };

  /**
   * sets up notification when the user refreshes the page
   */
  setUpNotification = () => {
    // dbService.collection('users')
    //   .doc(authService.currentUser.email)
    //   .collection('lists')
    //   .get()
    //   .then((listQuerySnapshot) => {
    //     listQuerySnapshot.docs.forEach((listDoc) => {
    //       dbService.collection('users')
    //         .doc(authService.currentUser.email)
    //         .collection('lists')
    //         .doc(listDoc.data().title)
    //         .collection('columns')
    //         .get()
    //         .then((columnQuerySnapshot) => {
    //           columnQuerySnapshot.docs.forEach((columnDoc) => {
    //             dbService.collection('users')
    //               .doc(authService.currentUser.email)
    //               .collection('lists')
    //               .doc(listDoc.data().title)
    //               .collection('columns')
    //               .doc(columnDoc.data().title)
    //               .collection('works')
    //               .get()
    //               .then((workQuerySnapshot) => {
    //                 workQuerySnapshot.docs.forEach((workDoc) => {
    //                   const dueDate = new Date(workDoc.data().dueDate);
    //                   const notificationTiming = workDoc.data().notification;
    //                   dueDate.setMinutes(dueDate.getMinutes() - notificationTiming);
    //                   if (dueDate > new Date()) {
    //                     new cron.CronJob(dueDate, () => {
    //                       new Notification('notification for ' + workDoc.data().description);
    //                       console.log('notification fired for the work: ' + workDoc.data().description)
    //                     }).start();
    //                   }
    //                 })
    //               })
    //           })
    //         })
    //     })
    //   })
  }

  /**
   * React life cycle method; fetches firestore data before the page loads
   */
  componentDidMount = () => {
    this.getMyLists();
    this.setUpNotification();
  };

  /**
   * Handles the change in the form input
   * @param {Event} event form input change event
   */
  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render = () => {
    const { classes } = this.props;
    return (
      <div>
        <AddList listAdd={this.listAdd} />
        <Grid container spacing={3} className={classes.root}>
          {this.state.listArray}
        </Grid>
      </div>
    );
  };
}

export default withStyles(styles)(Dashboard);
