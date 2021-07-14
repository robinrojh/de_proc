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
});
class EditDetails extends Component {
  state = {
    description: "",
    dueDate: new Date(),
    open: false,
    workId: "",
  };
  editDetails = (event) => {
    // if (req.body.description.trim() === "") {
    //   return res
    //     .status(400)
    //     .json({ description: "Description should not be empty" });
    // }
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
          dueDate: this.state.dueDate.toISOString(),
          completed: doc.data().completed,
          owner: doc.data().owner,
        };
        console.log(modifiedWork);
        work.update(modifiedWork);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  mapDetailsToState = (work) => {
    this.setState({
      description: work.description,
      dueDate: work.dueDate,
      workId: work.workId,
    });
  };
  handleOpen = () => {
    this.setState({ open: true });
    this.mapDetailsToState(this.props.work);
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  componentDidMount() {
    const { work } = this.props;
    this.mapDetailsToState(work);
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleSubmit = () => {
    this.editDetails();
    console.log(this.state.dueDate);
    this.props.edit(
      this.state.description,
      this.state.dueDate,
      this.props.work,
      this.props.columnName
    );
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
