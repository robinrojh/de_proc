import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { dbService, authService } from "../functions/util/fbase";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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
});
class EditDetails extends Component {
  state = {
    description: "",
    dueDate: new Date(),
    completed: false,
    open: false,
    workId: "",
    notification: 5,
  };

  editDetails = (event) => {
    const work = dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(this.props.listName)
      .collection("columns")
      .doc(this.props.columnName)
      .collection("works")
      .doc(this.state.workId);
    work
      .get()
      .then((doc) => {
        const modifiedWork = {
          description: this.state.description,
          dueDate: this.state.dueDate,
          completed: doc.data().completed,
          owner: doc.data().owner,
          notification: this.state.notification,
        };
        console.log(modifiedWork);
        work.update(modifiedWork);
      })
      .then(() => {
        this.props.edit(
          this.state.description,
          this.state.dueDate,
          this.state.notification,
          this.props.work,
          this.props.columnName
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * @param {work} work Takes in a work from it's parent state
   * With the given parameter, sets the state accordingly in order for editing process.
   */
  mapDetailsToState = (work) => {
    this.setState({
      description: work.description,
      dueDate: work.dueDate,
      completed: work.completed,
      workId: work.workId,
      notification: work.notification,
    });
  };

  /**
   * Sets the dialog state to open when the appropriate icon is
   * pressed in the ui, and shows the corresponding dialog
   */
  handleOpen = () => {
    this.setState({ open: true });
    this.mapDetailsToState(this.props.work);
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
    const { work } = this.props;
    this.mapDetailsToState(work);
  }

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
   * @param {event} event Data returned from picking due date with date picker.
   *
   * Data returned for due date change is different from other data like filling up a
   * form, etc, and hence has to be handled separately in order to correctly set the state
   * accoring to user input.
   */
  handleDuedateChange = (event) => {
    this.setState({
      dueDate: event.toISOString(),
    });
  };

  /**
   * Takes care of submitting the form. Request is sent to the backend database for editing.
   * this.props.edit() function is called to reflect immediate change
   * by making suitable changes in the parent state.
   */
  handleSubmit = () => {
    this.editDetails();
    console.log(this.state.dueDate);

    this.handleClose();
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Tooltip title="Edit your work" placement="top">
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
          <DialogTitle>Edit your work</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="description"
                type="text"
                label="Description"
                multiline
                rows="3"
                placeholder="Work description"
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

EditDetails.propTypes = {
  edit: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditDetails);
