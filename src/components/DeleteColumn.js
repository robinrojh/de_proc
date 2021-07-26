import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Typography, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { dbService, authService } from "../functions/util/fbase";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Checkbox from "@material-ui/core/Checkbox";

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
  card: {
    display: "flex",
    marginBottom: 20,
  },
  content: {
    padding: 20,
    objectFit: "cover",
  },
});

class DeleteColumns extends Component {
  state = {
    columns: []
  };

  /**
   * @param {columns} columns Takes in a list of columns from it's parent state
   *
   * With the given parameter, sets the state accordingly in order for deletion process.
   */
  mapDetailsToState = (columns) => {
    this.setState({
      columns: columns,
    });
    columns.forEach((column) => {
      console.log(column.title);
      this.setState({
        [column.id]: {
          selected: false,
        },
      });
    });
    console.log(this.state);
  };

  /**
   * Sets the dialog state to open when the appropriate icon is
   * pressed in the ui, and shows the corresponding dialog
   */
  handleOpen = () => {
    this.setState({ open: true });
    this.mapDetailsToState(this.props.columns);
  };

  /**
   * Sets the dialog state to close when the appropriate icon is
   * pressed in the ui, and closes the corresponding dialog
   */
  handleClose = () => {
    this.setState({ open: false });
  };

  /**
   * When the component mounts during its lifecycle, sets the state
   * accordingly for deletion process.
   */
  componentDidMount() {
    this.props.columns.forEach((column) => {
      this.setState({
        [column.id]: {
          selected: false,
        },
      });
    });
  }

  /**
   * @param {event} event Takes in an event, which is the user filling up a form, etc
   *
   * Sets the corresponding form's state according to user's input
   */
  handleChange = (column) => {
    this.state[column.id].selected
      ? this.setState({ [column.id]: { selected: false } })
      : this.setState({ [column.id]: { selected: true } });
  };

  /**
   * Takes care of submitting the form. Only selected columns for deletion are
   * filtered and request is sent to the backend database for deletion.
   * this.props.delete() function is called to reflect immediate change
   * by making suitable changes in the parent state.
   */
  handleSubmit = async () => {
    const filteredcolumn = this.state.columns.filter(
      (column) => this.state[column.id].selected
    );
    await filteredcolumn.forEach(async (column) => {
      console.log(column.id);
      await dbService
        .collection("users")
        .doc(authService.currentUser.email)
        .collection("lists")
        .doc(this.props.listName)
        .collection("columns")
        .doc(column.id)
        .collection("works")
        .get()
        .then((workSnapshot) => {
          workSnapshot.docs.forEach((work) => {
            dbService
              .collection("users")
              .doc(authService.currentUser.email)
              .collection("lists")
              .doc(this.props.listName)
              .collection("columns")
              .doc(column.id)
              .collection("works")
              .doc(work.id)
              .delete();
            console.log(work);
          });
        });
      await dbService
        .collection("users")
        .doc(authService.currentUser.email)
        .collection("lists")
        .doc(this.props.listName)
        .collection("columns")
        .doc(column.id)
        .delete()
        .then(() => {
          console.log(column.id);
          this.props.delete(column.id, column.title);
        });
    });
    console.log(filteredcolumn);
    this.handleClose();
  };
  render() {
    const { classes } = this.props;
    const columnComponent =
      this.state.columns && this.state.columns.length ? (
        this.state.columns.map((column) =>
          this.state[column.id] ? (
            <Card>
              <CardContent className={classes.content}>
                <Typography color="primary" varian="h4" display="inline">
                  {column.title}
                </Typography>
                <Checkbox
                  checked={this.state[column.id].selected}
                  onChange={() => this.handleChange(column)}
                  inputProps={{ "aria-label": "primary checkbox" }}
                  color="primary"
                />
              </CardContent>
            </Card>
          ) : (
            <p>Loading</p>
          )
        )
      ) : (
        <p>You have no columns to delete.</p>
      );
    return (
      <Fragment>
        <Tooltip title="Delete columns" placement="top">
          <IconButton onClick={this.handleOpen} className={classes.button}>
            <DeleteForeverIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Delete your column</DialogTitle>
          <DialogContent>{columnComponent}</DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(DeleteColumns);
