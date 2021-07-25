import React, { Component, Fragment } from "react";
import { authService, dbService } from "../functions/util/fbase";
import Grid from "@material-ui/core/Grid";
import Work from "./Work";
import withStyles from "@material-ui/core/styles/withStyles";
import { Button, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import AddWork from "../components/AddWork";
import Divider from "@material-ui/core/Divider";
import AddColumn from "../components/AddColumn";
import Box from "@material-ui/core/Box";
import DeleteColumn from "./DeleteColumn";
import EditColumn from "./EditColumn";

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

class ListDisplay extends Component {
  state = {
    listName: "",
    columns: [],
    rawColumns: [],
  };

  /**
   * @param {column} column Column in which the new work will be added.
   * @param {newWork} newWork New work to be added in the column.
   *
   * Adds the new work in the given column and updated the state
   * accorgingly in order to reflect immediate change in the ui.
   */
  addNewColumn = (column, newWork) => {
    let newColumns = this.state.columns;
    let newRawColumns = this.state.rawColumns;
    newRawColumns.push(column);
    let work = [];
    work.push(newWork);
    newColumns.push(column.id);
    this.setState({
      columns: newColumns,
      [column.id]: work,
      rawColumns: newRawColumns,
    });
  };

  /**
   *
   * @param {columnId} columnId Id for the column in the backend.
   * @param {columnName} columnName new title for the column.
   *
   * Column title with the corresponding columnId will be changed to
   * columnName, which is the new title provided by the user.
   */
  editColumn = (columnId, columnName) => {
    let newRawColumn = this.state.rawColumns;
    newRawColumn.map((col) => {
      if (col.id == columnId) {
        col.title = columnName;
      }
    });
    console.log(newRawColumn);
    this.setState({
      rawColumns: newRawColumn,
    });
  };

  /**
   * @param {newDescription} newDescription new description to be edited.
   * @param {newDueDate} newDueDate new due date to be edited
   * @param {newNotification} newNotification new notification setting to be edited
   * @param {oldWork} oldWork oldWork is required so that it can be identified from the state.
   * @param {column} column column in which the editing work is in.
   *
   * The work to be edited is identified using the oldWork, and its description, duedate and
   * notification setting is edited and the whole column with the edited work is set again
   * in the state.
   */
  editWork = (newDescription, newDueDate, newNotification, oldWork, column) => {
    console.log(column);
    let newColumn = this.state[column];
    console.log(newColumn);
    let ind = this.state[column].indexOf(oldWork);
    newColumn[ind].description = newDescription;
    newColumn[ind].dueDate = newDueDate;
    newColumn[ind].notification = newNotification;
    this.setState({
      [column]: newColumn,
    });
  };

  /**
   * @param {column} column column in which the work to be deleted is in
   * @param {work} work work which will be deleted
   *
   * work to be deleted is identified from the column, it is deleted and
   * the new column without the deleted work is set again in the state.
   */
  deleteWork = (column, work) => {
    let newColumn = this.state[column];
    let ind = this.state[column].indexOf(work);
    newColumn.splice(ind, 1);
    this.setState({
      [column]: newColumn,
    });
  };

  /**
   *
   * @param {column} column column in which the work to be added is in
   * @param {newWork} newWork new work to be added in the column
   *
   * new work is added to the column, and the column with the new work is
   * set again in the state.
   */
  addWork = (column, newWork) => {
    let newColumn = this.state[column];
    newColumn.push(newWork);
    this.setState({
      [column]: newColumn,
    });
  };

  /**
   * @param {columnId} columnId Id for the column to be deleted
   * @param {columnName} columnName Name of the column to be deleted.
   *
   * the given column is deleted from both raw column and columns, and
   * the list of work in the column is set to empty, to remove any work inside.
   */
  deleteColumn = (columnId, columnName) => {
    let modifiedRawColumn = this.state.rawColumns;
    let newRawColumn = this.state.rawColumns.filter(
      (col) => col.id == columnId
    );
    let index = this.state.rawColumns.indexOf(newRawColumn[0]);
    modifiedRawColumn.splice(index, 1);
    let modifiedColumns = this.state.columns;
    let ind = this.state.columns.indexOf(columnName);
    modifiedColumns.splice(ind, 1);
    this.setState({
      columns: modifiedColumns,
      rawColumns: modifiedRawColumn,
      [columnName]: [],
    });
    console.log(modifiedRawColumn);
  };

  /**
   * Fetches all the columns and works present in the backend and
   * sets state accordingly in order to display data on the ui.
   */
  async fetchColumnsAndWorks() {
    const title = this.props.match.params.listTitle;
    this.setState({
      listName: title,
    });
    let countOfOverdueWorks = 0;
    await dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(title)
      .collection("columns")
      .get()
      .then((data) => {
        data.forEach((doc) => {
          this.state.columns.push(doc.id);
          this.state.rawColumns.push({ id: doc.id, title: doc.data().title });
        });
      })
      .then(() => {
        console.log(this.state.rawColumns);
        this.state.columns.forEach(async (col) => {
          await dbService
            .collection("users")
            .doc(authService.currentUser.email)
            .collection("lists")
            .doc(title)
            .collection("columns")
            .doc(col)
            .collection("works")
            .orderBy("dueDate")
            .get()
            .then((data) => {
              let work = [];
              data.forEach((doc) => {
                work.push({
                  description: doc.data().description,
                  dueDate: doc.data().dueDate,
                  owner: doc.data().owner,
                  completed: doc.data().completed,
                  notification: doc.data().notification,
                  workId: doc.id,
                });
                if (new Date(doc.data().dueDate) <= new Date()) {
                  countOfOverdueWorks++;
                }
              });
              // new Notification(
              //   "You have " + countOfOverdueWorks + " tasks overdue!"
              // );
              return work;
            })
            .then((works) => {
              this.setState({
                [col]: works,
              });
            })
            .then(() => {
              console.log(this.state);
            });
        });
      })
      .then(() => {
        console.log(this.state);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * When the component mounts during its lifecycle, calls
   * fetchColumnsAndWorks() to set data accordingly.
   */
  async componentDidMount() {
    await this.fetchColumnsAndWorks();
  }
  render() {
    const { classes } = this.props;
    if (localStorage.authenticated) {
      let value = 0;
      let listOfWork =
        this.state.columns && this.state.columns.length ? (
          this.state.columns.map((column) => {
            console.log(this.state);
            let workList = this.state[column] ? (
              this.state[column].map((works) => {
                return (
                  <Work
                    work={works}
                    key={works.workId}
                    edit={this.editWork}
                    delete={this.deleteWork}
                    listName={this.state.listName}
                    columnName={column}
                  />
                );
              })
            ) : (
              <p>
                You have no columns. Create one by pressing the icon on the top
                left corner.
              </p>
            );
            value++;
            console.log(column);
            const columnName = this.state.rawColumns.filter(
              (col) => col.id === column
            )[0];
            console.log(columnName);
            console.log(this.state);

            return (
              <Fragment key={value}>
                <Divider orientation="vertical" flexItem />

                <Grid item xs>
                  <Typography variant="h6">
                    <Box fontStyle="oblique" fontFamily="Monospace">
                      {columnName.title}
                    </Box>
                  </Typography>
                  <Paper className={classes.paper}>
                    {workList}

                    <AddWork
                      add={this.addWork}
                      columnName={column}
                      listName={this.state.listName}
                    />
                  </Paper>
                </Grid>
                <Divider orientation="vertical" flexItem />
              </Fragment>
            );
          })
        ) : (
          <p>
            You have no columns. Create one by pressing the icon on the top left
            corner.
          </p>
        );
      return (
        <div>
          <AddColumn
            addNewColumn={this.addNewColumn}
            listName={this.state.listName}
          />
          <DeleteColumn
            columns={this.state.rawColumns}
            delete={this.deleteColumn}
            listName={this.state.listName}
          />
          <EditColumn
            columns={this.state.rawColumns}
            edit={this.editColumn}
            listName={this.state.listName}
          />
          <Grid container spacing={3} className={classes.root}>
            {listOfWork}
          </Grid>
        </div>
      );
    } else {
      return (
        <Paper className={classes.paper}>
          <Typography variant="body2" align="center">
            No profile found, please login
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/SignIn"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/SignUp"
            >
              Signup
            </Button>
          </div>
        </Paper>
      );
    }
  }
}

export default withStyles(styles)(ListDisplay);
