import React, { Component, Fragment } from "react";
import { authService, dbService } from "../functions/util/fbase";

import Grid from "@material-ui/core/Grid";

import withStyles from "@material-ui/core/styles/withStyles";

import { Link } from "react-router-dom";

import MuiLink from "@material-ui/core/Link";
import AddList from "../components/AddList";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const styles = (theme) => ({
  //   paper: {
  //     // padding: 10,
  //     // backgroudColor: "blue",
  //     border: "1px solid black",
  //   },
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
class Dashboard extends Component {
  //   constructor() {
  //     super();

  //   }
  state = {
    title: "",
    description: "",
    listArray: [],
    eventId: "",
    errors: {},
  };

  /**
   * Retrieves to-do lists from firestore database given that the user is logged in
   */
  //   getMyLists = () => {
  //     dbService
  //       .collection("users")
  //       .doc(authService.currentUser.email)
  //       .collection("lists")
  //       .onSnapshot((snapshot) => {
  //         let value = 0;
  //         const arr = snapshot.docs.map((element) => {
  //           value++;
  //           return <List key={value} listId={element.data().title} />;
  //         });
  //         this.setState({
  //           listArray: arr,
  //         });
  //       });
  //   };
  listAdd = (listName) => {
    const newLists = this.state.listArray;
    newLists.push(listName);
    this.setState({
      listArray: newLists,
    });
  };

  getMyLists = () => {
    const { classes } = this.props;
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .get()
      .then((data) => {
        let lists = [];
        data.forEach((list) => {
          this.state.listArray.push({
            title: list.id,
          });
        });
        return lists;
      })
      .then(() => {
        const modList = this.state.listArray.map((list) => {
          return (
            <Grid item xs={12}>
              <Card className={classes.card}>
                <CardContent className={classes.content}>
                  <MuiLink
                    component={Link}
                    to={`/lists/${list.title}`}
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
        });
        console.log(this.state.listArray);
        this.setState({
          listArray: modList,
        });
      })
      .then(() => {
        console.log(this.state.listArray);
      })
      //   .then((lists) => [
      //     this.setState({
      //       listArray: lists,
      //     }),
      //   ])
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * React life cycle method; fetches firestore data before the page loads
   */
  componentDidMount = () => {
    this.getMyLists();
  };

  /**
   * Handles the change in the form input
   * @param {Event} event form input change event
   */
  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Asynchronously handles the submission of the form
   * @param {Event} event form submission event
   */
  handleSubmit = async (event) => {
    event.preventDefault();
    const newWorkData = {
      title: this.state.title,
      description: this.state.description,
      owner: authService.currentUser.email,
    };
    await dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc("yay")
      .set(newWorkData);
    // Adds a new document to the subcollection works in users. Note: this will change based on the new database structure
    await dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("lists")
      .doc(this.state.title)
      .set(newWorkData);
    this.setState({
      title: "",
      description: "",
    });
  };

  render = () => {
    const { classes } = this.props;
    return (
      //   <>
      //     <h1>Make your to-do list here</h1>
      //     <form onSubmit={this.handleSubmit}>
      //       <input
      //         name="title"
      //         placeholder="Title"
      //         required
      //         value={this.state.email}
      //         onChange={this.handleChange}
      //       ></input>
      //       <input
      //         name="description"
      //         placeholder="Description"
      //         required
      //         value={this.state.nickname}
      //         onChange={this.handleChange}
      //       ></input>
      //       <input type="submit" value="Make a New List"></input>
      //     </form>
      // </>

      <div>
        <AddList listAdd={this.listAdd} />
        <Grid container spacing={3} className={classes.root}>
          {this.state.listArray}
        </Grid>
      </div>
    );

    //   render() {
    //     const { classes } = this.props;
    //     const authenticated = true;
    //     console.log(authenticated);
    //     if (authenticated) {
    //       let listOfWork = this.state.columns ? (
    //         this.state.columns.map((column) => {
    //           let workList = this.state[column] ? (
    //             this.state[column].map((works) => {
    //               return (
    //                 <Work
    //                   work={works}
    //                   key={works.workId}
    //                   edit={this.editWork}
    //                   delete={this.deleteWork}
    //                   column={column}
    //                 />
    //               );
    //             })
    //           ) : (
    //             <p>Loading...</p>
    //           );
    //           return (
    //             <Fragment>
    //               <Divider orientation="vertical" flexItem />

    //               <Grid item xs>
    //                 <Typography variant="h6">
    //                   <Box fontStyle="oblique" fontFamily="Monospace">
    //                     {column}
    //                   </Box>
    //                 </Typography>
    //                 <Paper className={classes.paper}>
    //                   {workList}

    //                   <AddWork reload={this.addWork} column={column} />
    //                 </Paper>
    //               </Grid>
    //               <Divider orientation="vertical" flexItem />
    //             </Fragment>
    //           );
    //         })
    //       ) : (
    //         <p>Loading...</p>
    //       );
    //       //   let recentWorksMarkup = this.state.work ? (
    //       //     this.state.work.map((incomingWork) => {
    //       //       return (
    //       //         <Work
    //       //           work={incomingWork}
    //       //           key={incomingWork.workId}
    //       //           reload={this.reload}
    //       //         />
    //       //       );
    //       //     })
    //       //   ) : (
    //       //     <p>Loading...</p>
    //       //   );
    //       return (
    //         <div>
    //           <AddColumn addNewColumn={this.addNewColumn} />
    //           <Grid container spacing={3} className={classes.root}>
    //             {listOfWork}
    //           </Grid>
    //         </div>
    //       );
    //     } else {
    //       return (
    //         <Paper className={classes.paper}>
    //           <Typography variant="body2" align="center">
    //             No profile found, please login
    //           </Typography>
    //           <div className={classes.buttons}>
    //             <Button
    //               variant="contained"
    //               color="primary"
    //               component={Link}
    //               to="/SignIn"
    //             >
    //               Login
    //             </Button>
    //             <Button
    //               variant="contained"
    //               color="secondary"
    //               component={Link}
    //               to="/SignUp"
    //             >
    //               Signup
    //             </Button>
    //           </div>
    //         </Paper>
    //       );
    //     }
    //   }
  };
}

export default withStyles(styles)(Dashboard);
