import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import { authService, dbService } from "../functions/util/fbase";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { validateAdditionData } from "../functions/util/validators";

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
    position: "relative",
    float: "left",
  },
});

/**
 * AddWork component is a button and modal for adding a work.
 */
class AddWork extends Component {
  initialState = {
    columnName: "",
    description: "",
    dueDate: new Date(),
    open: false,
    notification: 5,
    errors: {},
  };
  state = {
    columnName: "",
    description: "",
    dueDate: new Date(),
    open: false,
    notification: 5,
    errors: {},
  };

  /**
   * Takes care of adding the given column to the backend database
   * along with the first work provided by the user.
   */
  addColumn = async () => {
    const newWork = {
      owner: authService.currentUser.email,
      completed: false,
      description: this.state.description,
      dueDate: this.state.dueDate.toISOString(),
    };
    await dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(this.props.listName)
      .collection("columns")
      .add({
        owner: authService.currentUser.email,
        title: this.state.columnName,
      })
      .then((doc) => {
        this.setState({
          id: doc.id,
        });
      })
      .then(() => {
        dbService
          .collection("users")
          .doc(authService.currentUser.email)
          .collection("lists")
          .doc(this.props.listName)
          .collection("columns")
          .doc(this.state.id)
          .collection("works")
          .add(newWork)
          .then((doc) => {
            this.setState({
              workId: doc.id,
            });
          });
      })
      .then(() => {
        const workDetails = {
          description: this.state.description,
          dueDate: this.state.dueDate.toISOString(),
          owner: authService.currentUser.email,
          workId: this.state.workId,
          notification: this.state.notification,
          completed: false,
        };
        const column = {
          id: this.state.id,
          title: this.state.columnName,
        };
        this.props.addNewColumn(column, workDetails);
      })
      .then(() => {
        this.setState({
          ...this.initialState,
        });
      });
  };
  /**
   * Sets the dialog state to open when the appropriate icon is
   * pressed in the ui, and shows the corresponding dialog
   */
  handleOpen = () => {
    this.setState({ open: true });
  };

  /**
   * Sets the dialog state to close when the appropriate icon is
   * pressed in the ui, and closes the corresponding dialog
   */
  handleClose = () => {
    this.setState({ open: false });
  };

  /**
   * @param {event} event Data returned from the notification form
   *
   * Data returned from the notification form is different from other data,
   * so it had to be handled separately. It sets
   * the notification state to the user's choice in the ui.
   */
  handleNotificationChange = (event) => {
    this.setState({
      notification: event.target.value,
    });
  };

  /**
   * @param {event} event Takes in an event, which is the user filling up a form, etc
   *
   * Sets the corresponding form's state according to user's input
   */
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Takes care of submitting the form. It calls the addColumn() function
   * which adds data in the backend database, and also addNewColumn() function
   * which sets the new data in it's parent component's state in order to reflect
   * the change immediately.
   */
  handleSubmit = () => {
    this.setState({
      errors: {},
    });
    const data = {
      description: this.state.description,
      columnName: this.state.columnName,
      listName: this.state.listName,
    };
    const { valid, errors } = validateAdditionData(data);
    if (!valid) {
      this.setState({
        errors: { ...errors },
      });
    } else {
      this.addColumn();
      this.handleClose();
    }
  };

  /**
   * @param {event} event Data returned from picking due date with date picker.
   *
   * Data returned for due date change is different from other data like filling up a
   * form, etc, and hence has to be handled separately in order to correctly set the state
   * accoring to user input.
   */
  handleDuedateChange = (event) => {
    this.setState({
      dueDate: event,
    });
  };
  render() {
    const { classes } = this.props;
    const { errors } = this.state;
    return (
      <Fragment>
        <Tooltip title="Add new column" placement="top">
          <IconButton onClick={this.handleOpen} className={classes.button}>
            <PlaylistAddIcon color="primary" fontSize="large" />
          </IconButton>
        </Tooltip>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add a work for your new column!!</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="columnName"
                type="text"
                label="Column name"
                multiline
                rows="3"
                placeholder="Column name"
                error={errors.columnName ? true : false}
                helperText={errors.columnName}
                className={classes.textfield}
                value={this.state.columnName}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="description"
                type="text"
                label="Description"
                multiline
                rows="3"
                placeholder="Work description"
                error={errors.description}
                helperText={errors.description}
                className={classes.textfield}
                value={this.state.description}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  margin="normal"
                  name="dueDate"
                  id="date-picker-dialog"
                  label="Date picker dialog"
                  format="MM/dd/yyyy"
                  value={this.state.dueDate}
                  onChange={this.handleDuedateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
                <KeyboardTimePicker
                  name="dueDate"
                  margin="normal"
                  id="time-picker"
                  label="Time picker"
                  value={this.state.dueDate}
                  onChange={this.handleDuedateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <FormControl className={classes.formControl}>
              <InputLabel id="notification">Notification settings</InputLabel>
              <Select
                labelId="notification"
                id="notification"
                value={this.state.notification}
                onChange={this.handleNotificationChange}
              >
                <MenuItem value={5}>5 minutes</MenuItem>
                <MenuItem value={10}>10 minutes</MenuItem>
                <MenuItem value={15}>15 minutes</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

// AddWork.propTypes = {
//   addWork: PropTypes.func.isRequired,
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(AddWork);
