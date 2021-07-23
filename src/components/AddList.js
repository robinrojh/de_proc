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
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// const styles = (theme) => ({
//   ...theme,
// });

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
    // marginTop: 0,
    position: "relative",
    float: "left",
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
class AddList extends Component {
  initialState = {
    listName: "",
    columnName: "",
    description: "",
    dueDate: new Date(),
    open: false,
    notification: 5,
    workStart: 9,
    workEnd: 5
  };
  state = {
    listName: "",
    columnName: "",
    description: "",
    dueDate: new Date(),
    open: false,
    notification: 5,
    workStart: 9,
    workEnd: 5
  };
  addList = (event) => {
    console.log("adding");
    console.log(this.state.listName);
    console.log(this.state.columnName);
    // event.preventDefault();
    const newWork = {
      description: this.state.description,
      dueDate: this.state.dueDate.toISOString(),
      owner: authService.currentUser.email,
      completed: false,
    };
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(this.state.listName)
      .set({
        owner: authService.currentUser.email,
        title: this.state.listName,
        workStart: this.state.workStart,
        workEnd: this.state.workEnd
      });
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(this.state.listName)
      .collection("columns")
      .doc(this.state.columnName)
      .set({
        owner: authService.currentUser.email,
        title: this.state.columnName,
      });
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(this.state.listName)
      .collection("columns")
      .doc(this.state.columnName)
      .collection("works")
      .add(newWork);
    //   .doc(this.state.listName)
    //   .collection("columns")
    //   .doc(this.state.columnName)
    //   .collection("works")
    //   .add(newWork);
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleNotificationChange = (event) => {
    this.setState({
      notification: event.target.value,
    });
  };
  handleSubmit = () => {
    const workDetails = {
      description: this.state.description,
      dueDate: this.state.dueDate.toISOString(),
    };
    this.props.listAdd(this.state.listName);
    this.addList();
    this.setState({
      ...this.initialState,
    });
    this.handleClose();
  };
  handleDuedateChange = (event) => {
    this.setState({
      dueDate: event,
    });
  };
  render() {
    const { classes } = this.props;
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
              <InputLabel id="workhour">Work hours\</InputLabel>
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
