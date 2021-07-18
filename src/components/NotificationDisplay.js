import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Button, Typography } from "@material-ui/core";
import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
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
class NotificationDisplay extends Component {
  state = {};
  render() {
    const { classes, content } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography color="primary" varian="h4" display="inline">
            {content}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(NotificationDisplay);
