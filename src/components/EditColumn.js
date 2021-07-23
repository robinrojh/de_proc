import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Typography, Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
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
import { auth } from "firebase-admin";

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
  image: {
    margin: "20px auto 20ps auto",
  },
  pageTitle: {
    margin: "10px auto 10ps auto",
  },
  //   textField: {
  //     margin: "10px auto 10ps auto",
  //   },
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
  handleOpen = () => {
    this.setState({ open: true });
    this.mapDetailsToState(this.props.columns);
  };
  handleClose = () => {
    this.setState({ open: false });
  };
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
  handleChange = (event) => {
    this.setState({
      [event.target.name]: {
        title: event.target.value,
        edited: true,
        id: event.target.name,
      },
    });
  };
  handleSubmit = () => {
    // this.state.columns.forEach((column) => {
    //   console.log(column);
    //   if (this.state[column].selected) {
    //     dbService
    //       .collection("users")
    //       .doc(authService.currentUser.email)
    //       .collection("columns")
    //       .doc(column)
    //       .delete();
    //     this.props.delete(column);
    //   }
    // });
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
        });
      this.props.edit(this.state[column.id].id, this.state[column.id].title);
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
        <p>Loading</p>
      );
    return (
      <Fragment>
        <Tooltip title="Edit columns" placement="top">
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
