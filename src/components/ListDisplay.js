import React, { Component, Fragment } from "react";
import { authService, dbService } from "../functions/util/fbase";
import Grid from "@material-ui/core/Grid";
import Work from "./Work";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Button, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import AddWork from "../components/AddWork";
import Divider from "@material-ui/core/Divider";
import AddColumn from "../components/AddColumn";
import Box from "@material-ui/core/Box";

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
  };
  addNewColumn = (columnName, newWork) => {
    let newColumns = this.state.columns;
    let work = [];
    work.push(newWork);
    newColumns.push(columnName);
    this.setState({
      columns: newColumns,
      [columnName]: work,
    });
  };
  editWork = (newDescription, newDueDate, oldWork, column) => {
    console.log(column);
    let newColumn = this.state[column];
    console.log(newColumn);
    let ind = this.state[column].indexOf(oldWork);
    newColumn[ind].description = newDescription;
    newColumn[ind].dueDate = newDueDate;
    this.setState({
      [column]: newColumn,
    });
  };
  deleteWork = (column, work) => {
    let newColumn = this.state[column];
    let ind = this.state[column].indexOf(work);
    newColumn.splice(ind, 1);
    this.setState({
      [column]: newColumn,
    });
  };
  addWork = (column, newWork) => {
    let newColumn = this.state[column];
    newColumn.push(newWork);
    this.setState({
      [column]: newColumn,
    });
  };
  componentDidMount() {
    console.log(authService.currentUser);
    const title = this.props.match.params.listTitle;
    this.setState({
      listName: title,
    });
    console.log(title);
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(title)
      // dbService
      //   .doc(`users/${authService.currentUser}/lists/${title}`)
      .collection("columns")
      .get()
      .then((data) => {
        data.forEach((doc) => {
          this.state.columns.push(doc.data().title);
        });
      })
      .then(() => {
        this.state.columns.forEach((col) => {
          dbService
            // .doc(
            //   `users/${authService.currentUser.email}/lists/${title}/columns/${col}/works`
            // )
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
                  workId: doc.id,
                });
              });
              console.log(work);
              return work;
            })
            .then((works) => {
              this.setState({
                [col]: works,
              });
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
  render() {
    const { classes } = this.props;
    if (true) {
      let listOfWork = this.state.columns ? (
        this.state.columns.map((column) => {
          let workList = this.state[column] ? (
            this.state[column].map((works) => {
              return (
                <Work
                  work={works}
                  key={works.workId}
                  edit={this.editWork}
                  delete={this.deleteWork}
                  columnName={column}
                  listName={this.state.listName}
                />
              );
            })
          ) : (
            <p>Loading...</p>
          );
          return (
            <Fragment>
              <Divider orientation="vertical" flexItem />

              <Grid item xs>
                <Typography variant="h6">
                  <Box fontStyle="oblique" fontFamily="Monospace">
                    {column}
                  </Box>
                </Typography>
                <Paper className={classes.paper}>
                  {workList}

                  <AddWork
                    addWork={this.addWork}
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
        <p>Loading...</p>
      );
      return (
        <div>
          <AddColumn
            addNewColumn={this.addNewColumn}
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
