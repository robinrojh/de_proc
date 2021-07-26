import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
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
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "40ch",
    },
  },
  form: {
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    position: "relative",
    float: "right",
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

class EditList extends Component {
  state = {};

  /**
   * @param {columns} columns Takes in a list of columns from it's parent state
   * With the given parameter, sets the state accordingly in order for deletion process.
   */
  mapDetailsToState = (lists) => {
    this.setState({
      lists: lists,
    });
    lists.forEach((list) => {
      this.setState({
        [list.id]: {
          title: list.title,
          id: list.id,
          edited: false,
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
    this.mapDetailsToState(this.props.lists);
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
    this.props.lists.forEach((list) => {
      this.setState({
        [list.id]: {
          title: list.title,
          id: list.id,
          edited: false,
        },
      });
    });
  }

  /**
   * @param {event} event Takes in an event, which is the user filling up a form, etc
   *
   * Sets the corresponding form's state according to user's input
   */
  handleChange = (event) => {
    this.setState({
      [event.target.name]: {
        title: event.target.value,
        edited: true,
        id: event.target.name,
      },
    });
  };

  /**
   * Takes care of submitting the form. Only selected lists for editing are
   * filtered and request is sent to the backend database for editing.
   * this.props.edit() function is called to reflect immediate change
   * by making suitable changes in the parent state.
   */
  handleSubmit = () => {
    const filteredlist = this.state.lists.filter(
      (list) => this.state[list.id].edited
    );
    filteredlist.forEach((list) => {
      console.log(list);
      dbService
        .collection("users")
        .doc(authService.currentUser.email)
        .collection("lists")
        .doc(this.state[list.id].id)
        .update({
          owner: authService.currentUser.email,
          title: this.state[list.id].title,
        })
        .then(() => {
          this.props.edit(this.state[list.id]);
        });
    });
    console.log(filteredlist);
    this.handleClose();
  };
  render() {
    const { classes } = this.props;
    console.log(this.state);
    const listComponent =
      this.state.lists && this.state.lists.length ? (
        this.state.lists.map((list) => (
          <form className={classes.root}>
            <TextField
              id={"standard-basic"}
              name={list.id}
              type="text"
              label={list.title}
              placeholder="Work description"
              className={classes.textfield}
              value={this.state[list.id].title}
              onChange={this.handleChange}
              fullwidth
            />
          </form>
        ))
      ) : (
        <p>You have no lists to edit.</p>
      );
    return (
      <Fragment>
        <Tooltip title="Edit lists" placement="top">
          <IconButton onClick={this.handleOpen} className={classes.button}>
            <EditIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your list names</DialogTitle>
          <DialogContent>{listComponent}</DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(EditList);
