import React, { Component } from "react";
import { authService, dbService } from "../functions/util/fbase";
import NotificationDisplay from "../components/NotificationDisplay";
class Notification extends Component {
  state = {};

  /**
   * Retrives all the notification present in the backend, and
   * sets the state accordingly.
   */
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
          notifications.push({
            id: doc.id,
            content: doc.data().content,
          });
          console.log(notifications);
        });
        this.setState({ notifications });
        return notifications;
      });
  };

  /**
   *
   * @param {notification} notification notification to be deleted
   *
   * notification to be deleted is idenfieid from the notification array, and
   * is deleted. New notification array without the deleted notification is
   * set again in the state.
   */
  deleteNotification = (notification) => {
    let newNotifications = this.state.notifications;
    let ind = this.state.notifications.indexOf(notification);
    newNotifications.splice(ind, 1);
    this.setState({
      notifications: newNotifications,
    });
  };

  /**
   *
   * @param {notification} notification notification to be added
   *
   * notification is added in the notification array in the state.
   */
  addNotification = (notification) => {
    this.setState({
      notifications: {
        ...this.state.notifications,
        notification,
      },
    });
  };

  /**
   * React lifecycle method where it calls grabNotifications() when the component
   * mounts in order to set the state accordingly.
   */
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
  }
}

export default Notification;
