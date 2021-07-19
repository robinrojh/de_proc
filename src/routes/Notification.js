import React, { Component } from "react";
import { authService, dbService } from "../functions/util/fbase";
import NotificationDisplay from "../components/NotificationDisplay";
class Notification extends Component {
  state = {};
  grabNotifications = () => {
    dbService
      .collection("users")
      .doc(authService.currentUser.email)
      .collection("notification")
      .get()
      .then((data) => {
        let notifications = [];
        data.forEach((doc) => {
          console.log(doc.id);
          notifications.push(
            // <NotificationDisplay content={doc.data().content} />
            {
              id: doc.id,
              content: doc.data().content,
            }
          );
          console.log(notifications);
        });
        this.setState({ notifications });
        return notifications;
      });
  };
  deleteNotification = (notification) => {
    let newNotifications = this.state.notifications;
    let ind = this.state.notifications.indexOf(notification);
    newNotifications.splice(ind, 1);
    this.setState({
      notifications: newNotifications,
    });
  };
  addNotification = (notification) => {
    this.setState({
      notifications: {
        ...this.state.notifications,
        notification,
      },
    });
  };
  componentDidMount() {
    this.grabNotifications();
  }
  render() {
    let notificationList =
      this.state.notifications && this.state.notifications.length ? (
        this.state.notifications.map((notification) => (
          <NotificationDisplay
            notification={notification}
            delete={this.deleteNotification}
          />
        ))
      ) : (
        <p>You have no notifications</p>
      );
    return notificationList;
    //     return this.state.notifications ? (
    //       this.state.notifications
    //     ) : (
    //       <p>You have no notifications</p>
    //     );
    //   }
  }
}

export default Notification;
