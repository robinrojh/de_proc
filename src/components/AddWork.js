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
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const cron = require("cron");

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});
class AddWork extends Component {
  state = {
    description: "",
    dueDate: new Date(),
    open: false,
    notification: 5,
  };
  addWork = (event) => {
    // event.preventDefault();
    const newWork = {
      description: this.state.description,
      dueDate: this.state.dueDate.toISOString(),
      owner: authService.currentUser.email,
      completed: false,
      notification: this.state.notification
    };
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(this.props.listName)
      .collection("columns")
      .doc(this.props.columnName)
      .collection("works")
      .add(newWork)
      .catch((err) => {
        console.error(err);
      });
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
    // const workDetails = {
    //   description: this.state.description,
    //   dueDate: this.state.dueDate.toISOString()
    // };
    const newWork = {
      description: this.state.description,
      dueDate: this.state.dueDate.toISOString(),
    };
    this.addWork();
    console.log(this.props.column);
    this.props.add(this.props.columnName, newWork);
    this.handleClose();
    const date = new Date(this.state.dueDate);
    date.setMinutes(date.getMinutes() - this.state.notification);
    if (date > new Date()) {
      const job = new cron.CronJob(date, () => {
        new Notification('notification for ' + this.state.description);
        console.log('notification for ' + this.state.description + 'fired.')
      })
      job.start()
    }
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
                value={this.state.bio}
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

AddWork.propTypes = {
  add: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddWork);
