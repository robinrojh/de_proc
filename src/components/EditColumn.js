import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Typography, Button } from "@material-ui/core";
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

class EditColumn extends Component {
  state = {};

  /**
   * @param {columns} columns Takes in a list of columns from it's parent state
   * With the given parameter, sets the state accordingly in order for deletion process.
   */
  mapDetailsToState = (columns) => {
    this.setState({
      columns: columns,
    });
    columns.forEach((column) => {
      this.setState({
        [column.id]: {
          title: column.title,
          id: column.id,
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
          title: column.title,
          id: column.id,
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
   * Takes care of submitting the form. Only selected columns for editing are
   * filtered and request is sent to the backend database for editing.
   * this.props.edit() function is called to reflect immediate change
   * by making suitable changes in the parent state.
   */
  handleSubmit = () => {
    const filteredcolumn = this.state.columns.filter(
      (column) => this.state[column.id].edited
    );
    filteredcolumn.forEach((column) => {
      console.log(column);
      dbService
        .collection("users")
        .doc(authService.currentUser.email)
        .collection("lists")
        .doc(this.props.listName)
        .collection("columns")
        .doc(column.id)
        .update({
          owner: authService.currentUser.email,
          title: this.state[column.id].title,
        })
        .then(() => {
          this.props.edit(
            this.state[column.id].id,
            this.state[column.id].title
          );
        });
    });
    console.log(filteredcolumn);
    this.handleClose();
  };
  render() {
    const { classes } = this.props;
    console.log(this.state);
    const columnComponent =
      this.state.columns && this.state.columns.length ? (
        this.state.columns.map((column) => (
          //   <Card>
          //     <CardContent className={classes.content}>
          //       <Typography color="primary" varian="h4" display="inline">
          //         {column}
          //       </Typography>
          //       <Checkbox
          //         checked={this.state[column].selected}
          //         onChange={() => this.handleChange(column)}
          //         inputProps={{ "aria-label": "primary checkbox" }}
          //         color="primary"
          //       />
          //     </CardContent>
          //   </Card>
          <form className={classes.root}>
            <TextField
              id={"standard-basic"}
              name={column.id}
              type="text"
              label={column.title}
              placeholder="Work description"
              className={classes.textfield}
              value={this.state[column.id].title}
              onChange={this.handleChange}
              fullwidth
            />
          </form>
        ))
      ) : (
        <p>You have no columns to edit</p>
      );
    return (
      <Fragment>
        <Tooltip title="Edit columns" placement="top">
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
          <DialogTitle>Edit your column names</DialogTitle>
          <DialogContent>{columnComponent}</DialogContent>
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

export default withStyles(styles)(EditColumn);
