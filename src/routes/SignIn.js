import { React, Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AppIcon from "../images/icon.jpg";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { authService } from "../functions/util/fbase";
import { validateLoginData } from "../functions/util/validators";

const styles = {
  form: {
    textAlign: "center",
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain",
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
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: "20px",
  },
  progress: {
    position: "absolute",
  },
};

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    loading: false,
    errors: {},
  };

  componentDidMount() {
    this.setState({
      errors: {},
    });
  }
  /**
   * @param {event} event Takes in an event, which is the user filling up a form, etc
   *
   * Sets the corresponding form's state according to user's input
   */
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Authorize/login a user if the user is registered in the database.
   */
  handleSubmit = async (event) => {
    this.setState({
      errors: {},
      loading: true,
    });
    console.log(this.state);
    event.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password,
    };
    const { valid, errors } = validateLoginData(user);
    if (!valid) {
      this.setState({
        errors: {
          ...errors,
        },
        loading: false,
      });
    } else {
      try {
        await authService.signInWithEmailAndPassword(
          this.state.email,
          this.state.password
        );
        this.setState({
          loading: false,
        });
        // this.props.history.push("/Dashboard");
      } catch (error) {
        this.setState({
          errors: {
            general: "Wrong credentials, please try again.",
          },
          loading: false,
        });
      }
    }
  };

  render() {
    const { classes } = this.props;
    const { errors, loading } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt="monkey" className={classes.image} />
          <Typography variant="h2" className={classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Login
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              {" "}
              don't have an account ? sign up <Link to="/signup">here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);
