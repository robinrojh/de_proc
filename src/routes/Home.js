import { Grid } from "@material-ui/core";
import { render } from "@testing-library/react";
import { Link } from "react-router-dom";
import React, { Component } from "react";

class Home extends Component {
  render() {
    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          <p>Content,,</p>
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>profile..</p>
        </Grid>
      </Grid>
    );
  }
}

export default Home;
