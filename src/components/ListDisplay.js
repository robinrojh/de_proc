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
import Column from "./Column";

const cron = require('cron')

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

  getMyColumns = () => {
    const title = this.props.match.params.listTitle;
    this.setState({
      listName: title,
    });
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(title)
      .collection("columns")
      .onSnapshot((element) => {
        let value = 0;
        const columnsArr = this.state.columns ? (
          element.docs.map((doc) => {
            value++;
            return <Column
              key={value}
              columnId={doc.data().title}
              listId={this.state.listName}
              classes={this.props.classes}
            />
          })
        ) : (
          <p>Loading...</p>
        );
        this.setState({
          columns: columnsArr
        });
      })
  }

  // getMyWorks = () => {
  //   const title = this.props.match.params.listTitle;
  //   this.state.columns.forEach((col) => {
  //     dbService
  //       .collection("users")
  //       .doc(authService.currentUser.email)
  //       .collection("lists")
  //       .doc(title)
  //       .collection("columns")
  //       .doc(col)
  //       .collection("works")
  //       .orderBy("dueDate")
  //       .onSnapshot((element) => {
  //         const worksArr = element.docs.map((doc) => {
  //           return {
  //             description: doc.data().description,
  //             dueDate: doc.data().dueDate,
  //             owner: doc.data().owner,
  //             workId: doc.id,
  //           }
  //         })
  //         this.setState({
  //           [col]: worksArr
  //         })
  //       })
  //   });
  // }

  componentDidMount = async () => {
    try {
      this.getMyColumns();
    }
    catch (err) {
      console.error(err);
    };
  }

  render = () => {
    const { classes } = this.props;
    return (
      <div>
        <AddColumn
          addNewColumn={this.addNewColumn}
          listName={this.state.listName}
        />
        <Grid container spacing={3} className={classes.root}>
          {this.state.columns}
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(ListDisplay);
