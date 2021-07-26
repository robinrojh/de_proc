import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import "date-fns";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { dbService, authService } from "../functions/util/fbase";

const styles = (theme) => ({
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#00bcd4",
      dark: "#008394",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff",
    },
  },
  typography: {
    useNextVariants: true,
  },
  form: {
    textAlign: "center",
  },
  image: {
    margin: "20px auto 20ps auto",
  },
  pageTitle: {
    margin: "10px auto 10ps auto",
  },
  textField: {
    margin: "10px auto 10ps auto",
  },
  button: {
    marginTop: 20,
    position: "relative",
    float: "right",
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: "20px",
  },
  progress: {
    position: "absolute",
  },
});
class DeleteNotification extends Component {
  /**
   * Deletes the corresponding notification in the database,
   * and delete() function updated the parent state accordingly
   * in order to reflect change immediately.
   */
  handleSubmit = () => {
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("notification")
      .doc(this.props.notification.id)
      .delete()
      .then(() => {
        this.props.delete(this.props.content);
      });
  };
  render() {
    const { classes } = this.props;
    return (
      <Tooltip title="Delete notification" placement="top">
        <IconButton onClick={this.handleSubmit} className={classes.button}>
          <DeleteForeverIcon color="primary" />
        </IconButton>
      </Tooltip>
    );
  }
}

export default withStyles(styles)(DeleteNotification);
