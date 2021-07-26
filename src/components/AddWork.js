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
import AddIcon from "@material-ui/icons/Add";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
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
    // marginTop: 0,
    position: "relative",
    float: "left",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
});

/**
 * AddWork component is in charge of adding a work to the database.
 */
class AddWork extends Component {
  initialState = {
    description: "",
    dueDate: new Date(),
    open: false,
    notification: 5,
    workStart: 9,
    workEnd: 17,
    errors: {},
  };
  state = {
    description: "",
    dueDate: new Date(),
    open: false,
    notification: 5,
    workStart: 9,
    workEnd: 17,
    errors: {},
  };

  /**
   * Takes care of adding the given work to the backend database
   */
  addWork = (event) => {
    const newWork = {
      description: this.state.description,
      dueDate: this.state.dueDate.toISOString(),
      owner: authService.currentUser.email,
      completed: false,
      notification: this.state.notification,
    };
    // adds a new work to the works subcollection of the current user
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(this.props.listName)
      .collection("columns")
      .doc(this.props.columnName)
      .collection("works")
      .add(newWork)
      .then(() => {
        const newWork = {
          description: this.state.description,
          dueDate: this.state.dueDate.toISOString(),
        };
        this.props.add(this.props.columnName, newWork);
      })
      .then(() => {
        this.setState({
          ...this.initialState,
        });
      })
      .catch((err) => {
        console.error(err);
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
   * Takes care of submitting the form. It calls the addWork() function
   * which adds data in the backend database, and also add() function
   * which sets the new data in it's parent component's state in order to reflect
   * the change immediately.
   */
  handleSubmit = () => {
    this.setState({
      errors: {},
    });
    const data = {
      description: this.state.description,
    };
    const { valid, errors } = validateAdditionData(data);
    if (!valid) {
      this.setState({
        errors: { ...errors },
      });
    } else {
      this.addWork();
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
        <Tooltip title="Add new work" placement="top">
          <IconButton onClick={this.handleOpen} className={classes.button}>
            <AddIcon color="primary" fontSize="large" />
          </IconButton>
        </Tooltip>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add a new work!</DialogTitle>
          {/* Title of the work */}
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
                error={errors.description}
                helperText={errors.description}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
            {/* Due date for the work */}
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
            {/* Setting up notifications, including working hours */}
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
            {/* <FormControl className={classes.formControl}>
              <InputLabel id="workHour">Work hours</InputLabel>
              <Select
                labelId="workStart"
                id="workStart"
                value={this.state.workStart}
                onChange={this.handleChange}
              >
                <MenuItem value={4}>4 am</MenuItem>
                <MenuItem value={5}>5 am</MenuItem>
                <MenuItem value={6}>6 am</MenuItem>
                <MenuItem value={7}>7 am</MenuItem>
                <MenuItem value={8}>8 am</MenuItem>
                <MenuItem value={9}>9 am</MenuItem>
                <MenuItem value={10}>10 am</MenuItem>
                <MenuItem value={11}>11 am</MenuItem>
                <MenuItem value={12}>12 pm</MenuItem>
              </Select>
              <Select
                labelId="workEnd"
                id="workEnd"
                value={this.state.workEnd}
                onChange={this.handleChange}
              >
                <MenuItem value={16}>4 pm</MenuItem>
                <MenuItem value={17}>5 pm</MenuItem>
                <MenuItem value={18}>6 pm</MenuItem>
                <MenuItem value={19}>7 pm</MenuItem>
                <MenuItem value={20}>8 pm</MenuItem>
                <MenuItem value={21}>9 pm</MenuItem>
                <MenuItem value={22}>10 pm</MenuItem>
                <MenuItem value={23}>11 pm</MenuItem>
                <MenuItem value={24}>12 am</MenuItem>
              </Select>
            </FormControl> */}
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

AddWork.propTypes = {
  add: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddWork);
