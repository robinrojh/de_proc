import { Box, Divider, Grid, Paper, Typography, withStyles } from "@material-ui/core";
import React from "react";
import { Fragment } from "react";
import { authService, dbService } from "../functions/util/fbase";
import AddWork from "./AddWork";
import Work from "./Work";
import PropTypes from "prop-types";

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

class Column extends React.Component {
  /**
   *
   * @param {Number, String, String, String, String} props contains
   * key, title, description, listId, columnId, respectively.
   */
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      workList: [],
      eventId: "",
      errors: {},
    };
  }

  /**
   * Retrieves work from firestore database given that the user is logged in
   */
  getMyWorks = () => {
    const { classes } = this.props;
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(this.props.listId)
      .collection("columns")
      .doc(this.props.columnId)
      .collection("works")
      .onSnapshot((snapshot) => {
        let value = 0;
        if (!snapshot.empty) {
          const arr = snapshot.docs.map((element) => {
            value++;
            return (
              <Work
                key={value}
                title={element.data().title}
                description={element.data().description}
                dueDate={element.data().dueDate}
                listId={this.props.listId}
                columnId={this.props.columnId}
                workId={element.id}
                classes={classes}
              />
            );
          });

          this.setState({
            workList: arr,
          });
        }
      });
  };

  /**
   * React life cycle method to fetch firestore data before the page loads
   */
  componentDidMount = () => {
    try {
      this.getMyWorks();
    }
    catch (error) {
      console.error(error);
    }
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

  /**
   * Asynchronously handles the submission of the form
   * Adds another column to the dashboard
   * @param {Event} event form submission event
   */
  handleSubmit = async (event) => {
    event.preventDefault();
    const newWorkData = {
      title: this.state.title,
      description: this.state.description,
      owner: authService.currentUser.email,
    };
    // Adds a new document to the subcollection works in users.
    await dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(this.props.listId)
      .collection("columns")
      .doc(this.props.columnId)
      .collection("works")
      .doc(this.state.title)
      .set(newWorkData);
    this.setState({
      title: "",
      description: "",
    });
  };

  /**
   * Handles the change in the form during editing process
   * @param {Event} event refers to the change in the event editing form inputs
   */
  handleEditChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Handles the edit button clicks. Changes isEditing state to true
   * @param {Event} event button clicking event for editing
   */
  onEditClick = (event) => {
    event.preventDefault();
    this.setState({
      isEditing: true,
    });
  };

  /**
   * Handles the cancel edit button clicks. Terminates editing by setting
   * isEditing to false
   * @param {Event} event button clicking event for canceling
   */
  onCancelClick = (event) => {
    event.preventDefault();
    this.setState({
      isEditing: false,
    });
  };

  /**
   * Asynchronously handles the submission of the editing form. Updates the
   * existing values of the selected work.
   * @param {Event} event submission event for input form
   */
  handleEditSubmit = async (event) => {
    event.preventDefault();
    await dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(this.props.listId)
      .collection("columns")
      .doc(this.props.columnId)
      .update({
        title: this.state.newTitle,
        description: this.state.newDescription,
      });
    this.setState({
      isEditing: false,
    });
  };

  /**
   * Deletes the selected work after getting a confirmation from the user
   * using window.confirm method
   * @param {Event} event button clicking event for deletion
   */
  handleDeleteClick = async (event) => {
    event.preventDefault();
    let ok;
    ok = window.confirm("Are you sure you want to delete this work?");
    if (ok) {
      await dbService
        .collection("users")
        .doc(authService.currentUser.email)
        .collection("lists")
        .doc(this.props.listId)
        .collection("columns")
        .doc(this.props.columnId)
        .delete();
    }
  };

  render = () => {
    const { classes } = this.props;
    return (
      <Fragment>
        <Divider orientation="vertical" flexItem />
        <Grid item xs>
          <Typography variant="h6">
            <Box fontStyle="oblique" fontFamily="Monospace">
              {this.props.columnId}
            </Box>
          </Typography>
          <Paper className={classes.paper}>
            {this.state.workList}
            <AddWork
              addWork={this.addWork}
              columnName={this.props.columnId}
              listName={this.state.listName}
            />
          </Paper>
        </Grid>
        <Divider orientation="vertical" flexItem />
      </Fragment>
    );
  };
}

Column.propTypes = {
  columnId: PropTypes.string.isRequired,
  listId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Column);
