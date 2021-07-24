import React, { Component } from "react";
import { authService, dbService } from "../functions/util/fbase";

import Grid from "@material-ui/core/Grid";

import withStyles from "@material-ui/core/styles/withStyles";

import { Link } from "react-router-dom";

import MuiLink from "@material-ui/core/Link";
import AddList from "../components/AddList";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

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
class List extends Component {
  state = {};

  render() {
    const { list, classes } = this.props;
    return (
      <Grid item xs={12} key={list}>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <MuiLink
              component={Link}
              to={`/lists/${list.id}`}
              color="primary"
              variant="h5"
            >
              {list.title}
              <hr />
            </MuiLink>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(List);
