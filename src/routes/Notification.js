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
          notifications.push(
            <NotificationDisplay content={doc.data().content} />
          );
        });
        this.setState({ notifications });
        return notifications;
      });
  };
  componentDidMount() {
    this.grabNotifications();
  }
  render() {
    return this.state.notifications ? (
      this.state.notifications
    ) : (
      <p>You have no notifications</p>
    );
  }
}

export default Notification;
