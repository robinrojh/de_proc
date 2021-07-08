import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Button, Typography } from "@material-ui/core";
import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import EditDetails from "./EditDetails";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import Grid from "@material-ui/core/Grid";
import DeleteWork from "./DeleteWork";
import { Delete } from "@material-ui/icons";
import Checkbox from "@material-ui/core/Checkbox";

dayjs.extend(relativeTime);

const styles = (theme) => ({
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  root: {
    flexGrow: 1,
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px",
    },
  },
});
class Work extends Component {
  state = {
    completed: this.props.completed,
  };
  handleChange = () => {
    this.state.completed
      ? this.setState({ completed: false })
      : this.setState({ completed: true });
  };
  render() {
    const {
      classes,
      description, 
      dueDate, 
      workId,
    } = this.props;
    return (
      <Grid key={workId}>
        <Grid item>
          <Card className={classes.card}>
            <CardContent className={classes.content}>
              <Typography color="primary" varian="h4" display="inline">
                {description}
              </Typography>
              <Typography color="textSecondary" variant="h5">
                {this.state.completed
                  ? "Completed!!"
                  : `Due ${dayjs(dayjs(new Date())).to(dueDate)}`}
              </Typography>
            </CardContent>
            <EditDetails
              work={{description, dueDate, workId}}
              edit={this.props.edit}
              columnName={this.props.columnName}
              listName={this.props.listName}
            />
            <DeleteWork
              work={this.props.work}
              delete={this.props.delete}
              columnName={this.props.columnName}
              listName={this.props.listName}
            />
            <Checkbox
              checked={this.state.completed}
              onChange={this.handleChange}
              inputProps={{ "aria-label": "primary checkbox" }}
              color="primary"
            />
          </Card>
        </Grid>
        {/* <Grid item></Grid> */}
      </Grid>
    );
  }
}

export default withStyles(styles)(Work);
