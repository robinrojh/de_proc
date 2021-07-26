import { React, Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import AppIcon from "../images/icon.jpg";
import { authService, dbService } from "../functions/util/fbase";
import { validateSignUpData } from "../functions/util/validators";

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

class SignUp extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    errors: {},
  };

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
   * Creates a new user in the backend database with
   * email and passwork provided by the user.
   */
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      errors: {},
      loading: true,
    });
    const userObj = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      nickname: this.state.nickname,
    };
    const { valid, errors } = validateSignUpData(userObj);
    if (!valid) {
      this.setState({
        errors: { ...errors },
      });
    } else {
      try {
        await authService.createUserWithEmailAndPassword(
          this.state.email,
          this.state.password
        );

        await dbService.collection("users").doc(this.state.email).set(userObj);
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          this.setState({
            errors: {
              email: "Email already in use",
            },
            loading: false,
          });
        } else {
          this.setState({
            errors: {
              general: "Something went wrong, please try again",
            },
            loading: false,
          });
        }
      }
    }
  };

  //   setAuthorizationHeader = (token) => {
  //     const FBIdToken = `Bearer ${token}`;
  //     localStorage.setItem("FBIdToken", FBIdToken);
  //     axios.defaults.headers.common["Authorization"] = FBIdToken;
  //   };

  render = () => {
    const { classes, loading } = this.props;
    const { errors } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt="monkey" className={classes.image} />
          <Typography variant="h2" className={classes.pageTitle}>
            Signup
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
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              className={classes.textField}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="nickname"
              name="nickname"
              type="nickname"
              label="Nickname"
              className={classes.textField}
              helperText={errors.nickname}
              error={errors.nickname ? true : false}
              value={this.state.nickname}
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
              Signup
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              {" "}
              Already have an account ? login <Link to="/SignIn">here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  };
}
SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SignUp);
