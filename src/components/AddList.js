import React, { Component, Fragment } from "react";
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
});

/**
 * AddList is a component for adding a list into the database.
 * It consists of a button and a modal.
 */
class AddList extends Component {
  initialState = {
    listName: "",
    columnName: "",
    description: "",
    dueDate: new Date(),
    open: false,
    notification: 5,
    workStart: 9,
    workEnd: 5,
    errors: {},
  };
  state = {
    listName: "",
    columnName: "",
    description: "",
    dueDate: new Date(),
    open: false,
    notification: 5,
    workStart: 9,
    workEnd: 5,
    errors: {},
    reloader: null,
  };

  /**
   * Takes care of adding the given list to the backend database
   * along with the first column and work provided by the user.
   */
  addList = async () => {
    console.log("adding");
    console.log(this.state.listName);
    console.log(this.state.columnName);
    const newWork = {
      description: this.state.description,
      dueDate: this.state.dueDate.toISOString(),
      owner: authService.currentUser.email,
      completed: false,
      notification: this.state.notification,
    };
    // Adds the list to the database
    await dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .add({
        owner: authService.currentUser.email,
        title: this.state.listName,
        workStart: this.state.workStart,
        workEnd: this.state.workEnd,
      })
      .then((doc) => {
        this.setState({
          listId: doc.id,
        });
        console.log(this.state);
        dbService
          .collection("users")
          .doc(authService.currentUser.email)
          .collection("lists")
          .doc(doc.id)
          .collection("columns")
          .add({
            owner: authService.currentUser.email,
            title: this.state.columnName,
          })
          .then((column) => {
            dbService
              .collection("users")
              .doc(authService.currentUser.email)
              .collection("lists")
              .doc(this.state.listId)
              .collection("columns")
              .doc(column.id)
              .collection("works")
              .add(newWork);
          })
          .then(() => {
            this.props.listAdd(this.state.listName);
          })
          .then(() => {
            this.setState({
              ...this.initialState,
            });
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
   * Takes care of submitting the form. It calls the addList() function
   * which adds data in the backend database, and also listAdd() function
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
      this.addList();
      this.handleClose();
      this.setState({ reloader: null });
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
        <Tooltip title="Add new List" placement="top">
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
          <DialogTitle>Add a column for your new list!!</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="listName"
                type="text"
                label="List name"
                multiline
                rows="3"
                placeholder="List name"
                error={errors.listName}
                helperText={errors.listName}
                className={classes.textfield}
                value={this.state.listName}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="columnName"
                type="text"
                label="Column name"
                multiline
                rows="3"
                placeholder="Column name"
                error={errors.columnName}
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
            <FormControl className={classes.formControl}>
              <InputLabel id="workhour">Work hours</InputLabel>
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
                <MenuItem value={4}>4 pm</MenuItem>
                <MenuItem value={5}>5 pm</MenuItem>
                <MenuItem value={6}>6 pm</MenuItem>
                <MenuItem value={7}>7 pm</MenuItem>
                <MenuItem value={8}>8 pm</MenuItem>
                <MenuItem value={9}>9 pm</MenuItem>
                <MenuItem value={10}>10 pm</MenuItem>
                <MenuItem value={11}>11 pm</MenuItem>
                <MenuItem value={12}>12 am</MenuItem>
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

export default withStyles(styles)(AddList);
