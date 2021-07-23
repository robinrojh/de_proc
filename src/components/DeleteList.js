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

class DeleteList extends Component {
  state = {};
  mapDetailsToState = (lists) => {
    this.setState({
      lists: lists,
    });
    lists.forEach((list) => {
      this.setState({
        [list]: {
          selected: false,
        },
      });
    });
    console.log(this.state);
  };
  handleOpen = () => {
    this.setState({ open: true });
    this.mapDetailsToState(this.props.lists);
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  componentDidMount() {
    this.props.lists.forEach((list) => {
      this.setState({
        [list]: {
          selected: false,
        },
      });
    });
  }
  handleChange = (list) => {
    this.state[list].selected
      ? this.setState({ [list]: { selected: false } })
      : this.setState({ [list]: { selected: true } });
  };
  handleSubmit = () => {
    // this.state.lists.forEach((list) => {
    //   console.log(list);
    //   if (this.state[list].selected) {
    //     dbService
    //       .collection("users")
    //       .doc(authService.currentUser.email)
    //       .collection("lists")
    //       .doc(list)
    //       .delete();
    //     this.props.delete(list);
    //   }
    // });
    const filteredList = this.state.lists.filter(
      (list) => this.state[list].selected
    );
    filteredList.forEach((list) => {
      dbService
        .collection("users")
        .doc(authService.currentUser.email)
        .collection("lists")
        .doc(list)
        .delete();
      this.props.delete(list);
    });
    console.log(filteredList);
    this.handleClose();
  };
  render() {
    const { classes } = this.props;
    const listComponent =
      this.state.lists && this.state.lists.length ? (
        this.state.lists.map((list) => (
          <Card>
            <CardContent className={classes.content}>
              <Typography color="primary" varian="h4" display="inline">
                {list}
              </Typography>
              <Checkbox
                checked={this.state[list].selected}
                onChange={() => this.handleChange(list)}
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
        <Tooltip title="Delete lists" placement="top">
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
          <DialogTitle>Delete your list</DialogTitle>
          <DialogContent>{listComponent}</DialogContent>
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

export default withStyles(styles)(DeleteList);
