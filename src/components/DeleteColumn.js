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
// import { auth } from "firebase-admin";

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
  card: {
    display: "flex",
    marginBottom: 20,
  },
  content: {
    padding: 20,
    objectFit: "cover",
  },
});

class DeleteColumns extends Component {
  state = {};
  mapDetailsToState = (columns) => {
    this.setState({
      columns: columns,
    });
    columns.forEach((column) => {
      console.log(column.title);
      this.setState({
        [column.id]: {
          selected: false,
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
          selected: false,
        },
      });
    });
  }
  handleChange = (column) => {
    this.state[column.id].selected
      ? this.setState({ [column.id]: { selected: false } })
      : this.setState({ [column.id]: { selected: true } });
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
      (column) => this.state[column.id].selected
    );
    filteredcolumn.forEach(async (column) => {
      const columnRef =
        dbService
          .collection("users")
          .doc(authService.currentUser.email)
          .collection("lists")
          .doc(this.props.listName)
          .collection("columns")
          .doc(column.id);

      await columnRef
        .collection("works")
        .get()
        .then((workSnapshot) => {
          workSnapshot.docs.forEach((work) => {
            columnRef.collection("works").doc(work.id).delete();
          })
        })
      await columnRef.delete();
      this.props.delete(column.id, column.title);
    });
    console.log(filteredcolumn);
    this.handleClose();
  };
  render() {
    const { classes } = this.props;
    const columnComponent =
      this.state.columns && this.state.columns.length ? (
        this.state.columns.map((column) => (
          <Card>
            <CardContent className={classes.content}>
              <Typography color="primary" varian="h4" display="inline">
                {column.title}
              </Typography>
              <Checkbox
                checked={this.state[column.id].selected}
                onChange={() => this.handleChange(column)}
                inputProps={{ "aria-label": "primary checkbox" }}
                color="primary"
              />
            </CardContent>
          </Card>
        ))
      ) : (
        <p>Loading</p>
      );
    return (
      <Fragment>
        <Tooltip title="Delete columns" placement="top">
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
          <DialogTitle>Delete your column</DialogTitle>
          <DialogContent>{columnComponent}</DialogContent>
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

export default withStyles(styles)(DeleteColumns);
