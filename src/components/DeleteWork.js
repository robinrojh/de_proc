import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import "date-fns";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

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
class DeleteWork extends Component {
  handleSubmit = () => {
    axios.delete(`/work/${this.props.column}/${this.props.work.workId}`);
    this.props.delete(this.props.column, this.props.work);
  };
  render() {
    const { classes } = this.props;
    return (
      <Tooltip title="Delete work" placement="top">
        <IconButton onClick={this.handleSubmit} className={classes.button}>
          <DeleteForeverIcon color="primary" />
        </IconButton>
      </Tooltip>
    );
  }
}

DeleteWork.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeleteWork);
