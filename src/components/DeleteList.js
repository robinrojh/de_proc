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
  textField: {
    margin: "10px auto 10ps auto",
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

class DeleteList extends Component {
  state = {};

  /**
   * @param {lists} lists Takes in a list of lists from it's parent state
   * With the given parameter, sets the state accordingly in order for deletion process.
   */
  mapDetailsToState = (lists) => {
    this.setState({
      lists: lists,
    });
    lists.forEach((list) => {
      console.log(list.title);
      this.setState({
        [list.id]: {
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
  handleChange = (list) => {
    this.state[list.id].selected
      ? this.setState({ [list.id]: { selected: false } })
      : this.setState({ [list.id]: { selected: true } });
  };

  /**
   * Takes care of submitting the form. Only selected lists for deletion are
   * filtered and request is sent to the backend database for deletion.
   * this.props.delete() function is called to reflect immediate change
   * by making suitable changes in the parent state.
   */
  handleSubmit = () => {
    const filteredlist = this.state.lists.filter(
      (list) => this.state[list.id].selected
    );
    filteredlist.forEach(async (list) => {
      const listRef = dbService
        .collection("users")
        .doc(authService.currentUser.email)
        .collection("lists")
        .doc(list.id);
      await listRef
        .collection("columns")
        .get()
        .then((columnSnapshot) => {
          columnSnapshot.docs.forEach((column) => {
            const columnRef = listRef.collection("columns").doc(column.id);
            columnRef
              .collection("works")
              .get()
              .then((workSnapshot) => {
                workSnapshot.docs.forEach((work) => {
                  columnRef.collection("works").doc(work.id).delete();
                });
              });
            columnRef.delete();
          });
        });
      await listRef.delete();
      this.props.delete(list);
    });
    console.log(filteredlist);
    this.handleClose();
  };
  render() {
    const { classes } = this.props;
    const listComponent =
      this.state.lists && this.state.lists.length ? (
        this.state.lists.map((list) => (
          <Card>
            <CardContent className={classes.content}>
              <Typography color="primary" varian="h4" display="inline">
                {list.title}
              </Typography>
              <Checkbox
                checked={this.state[list.id].selected}
                onChange={() => this.handleChange(list)}
                inputProps={{ "aria-label": "primary checkbox" }}
                color="primary"
              />
            </CardContent>
          </Card>
        ))
      ) : (
        <p>You have no lists to delete.</p>
      );
    return (
      <Fragment>
        <Tooltip title="Delete lists" placement="top">
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
          <DialogTitle>Delete your list</DialogTitle>
          <DialogContent>{listComponent}</DialogContent>
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

export default withStyles(styles)(DeleteList);
