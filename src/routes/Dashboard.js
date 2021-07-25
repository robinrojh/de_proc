import React, { Component } from "react";
import { authService, dbService } from "../functions/util/fbase";

import Grid from "@material-ui/core/Grid";

import withStyles from "@material-ui/core/styles/withStyles";

import { Link } from "react-router-dom";

import MuiLink from "@material-ui/core/Link";
import AddList from "../components/AddList";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "../components/List";
import DeleteList from "../components/DeleteList";
import EditList from "../components/EditList";

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

  listAdd = (list) => {
    const newLists = this.state.listArray;
    newLists.push(list);
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
          console.log(list.data().title);
          lists.push({
            id: list.id,
            title: list.data().title,
          });
        });
        this.setState({
          listArray: lists,
        });
      });
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
  };

  /**
   * React life cycle method; fetches firestore data before the page loads
   */
  componentDidMount = () => {
    this.getMyLists();
    this.setUpNotification();
  };

  /**
   * @param {event} event Takes in an event, which is the user filling up a form, etc
   *
   * Sets the corresponding form's state according to user's input
   */
  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /**
   * @param {list} list list which will be deleted.
   *
   * list is removed from the list array, and new array without
   * the deleted list is set again in the state.
   */
  deleteList = (list) => {
    let newList = this.state.listArray;
    let ind = this.state.listArray.indexOf(list);
    newList.splice(ind, 1);
    this.setState({
      listArray: newList,
    });
  };

  /**
   *
   * @param {listName} listName list to be edited.
   *
   * list with the same id as the listName will be identified, and
   * its title will be set to listName's title, which is the new
   * title provided by the user.
   */
  editList = (listName) => {
    let newList = this.state.listArray;
    newList.map((list) => {
      if (list.id == listName.id) {
        list.title = listName.title;
      }
    });
    this.setState({
      listArray: newList,
    });
  };

  render = () => {
    console.log(this.state.listArray);
    const { classes } = this.props;
    console.log(this.state.listArray);
    const componentList =
      this.state.listArray && this.state.listArray.length ? (
        this.state.listArray.map((listName) => <List list={listName} />)
      ) : (
        <p>
          You have no lists. Create one by pressing the icon on the top left
          corner.
        </p>
      );
    return (
      <div>
        <AddList listAdd={this.listAdd} />
        <DeleteList lists={this.state.listArray} delete={this.deleteList} />
        <EditList lists={this.state.listArray} edit={this.editList} />
        <Grid container spacing={3} className={classes.root}>
          {componentList}
        </Grid>
      </div>
    );
  };
}

export default withStyles(styles)(Dashboard);
