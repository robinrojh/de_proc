import AppRouter from './components/AppRouter'
import './App.css';
import { useEffect, useState } from "react";
import { authService, dbService } from "./functions/util/fbase";
import { Redirect } from 'react-router';

const App = () => {
  // Provides a basic router for all the paths in the website.
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cron = require('cron')
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      }
      else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })

        // Access list subcollection within user collection
    // Uses onSnapshot to detect any changes in notification in individual works
    if (authService.currentUser) {
      dbService
        .collection("users")
        .doc(authService.currentUser.email)
        .collection("lists")
        .onSnapshot((listQuerySnapshot) => {
          listQuerySnapshot.docs.forEach((listDoc) => {
            if (
              new Date().getHours() < listDoc.data().workStart &&
              new Date().getMinutes() < 45
            ) {
              // Send notification 15 minutes before work hour begins
              const notifTime = new Date();
              notifTime.setHours(listDoc.data().workStart - 1);
              notifTime.setMinutes(45);
              new cron.CronJob(notifTime, () => {
                new Notification({
                  title: "Get ready for your work!",
                  body: "Take a look at your to-do list first!",
                });
              }).start();
            }
            if (
              new Date().getHours() <= listDoc.data().workEnd &&
              new Date().getMinutes() < 45
            ) {
              // Send notification 15 minutes before work hour ends
              const notifTime = new Date();
              notifTime.setHours(listDoc.data().workEnd - 1);
              notifTime.setMinutes(45);
              new cron.CronJob(notifTime, () => {
                new Notification({
                  title: "Are you done with your work?",
                  body: "Take a look at your to-do list before you leave!",
                });
              }).start();
            }
            // Access column subcollection
            dbService
              .collection("users")
              .doc(authService.currentUser.email)
              .collection("lists")
              .doc(listDoc.id)
              .collection("columns")
              .onSnapshot((columnQuerySnapshot) => {
                columnQuerySnapshot.docs.forEach((columnDoc) => {
                  console.log(columnDoc.data())
                  // Access work collection
                  dbService
                    .collection("users")
                    .doc(authService.currentUser.email)
                    .collection("lists")
                    .doc(listDoc.id)
                    .collection("columns")
                    .doc(columnDoc.id)
                    .collection("works")
                    .onSnapshot((workQuerySnapshot) => {
                      workQuerySnapshot.docs.forEach((workDoc) => {
                        console.log(workDoc.data())
                        const dueDate = new Date(workDoc.data().dueDate);
                        const notificationTiming = workDoc.data().notification;
                        dueDate.setMinutes(
                          dueDate.getMinutes() - notificationTiming
                        );
                        dueDate.setSeconds(0);
                        if (dueDate > new Date() && !workDoc.data().completed) {
                          console.log('notif success')
                          new cron.CronJob(dueDate, () => {
                            const notification = {
                              content:
                                "Notification for " +
                                workDoc.data().description,
                            };
                            dbService
                              .collection("users")
                              .doc(authService.currentUser.email)
                              .collection("notification")
                              .add(notification);
                            new Notification(
                              "notification for " + workDoc.data().description
                            );
                            console.log(
                              "notification fired for the work: " +
                                workDoc.data().description
                            );
                          }).start();
                        }
                      });
                    });
                });
              });
          });
        });
    }
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isLoggedIn])
  return (
    <>
      {init ?
        <>
          <AppRouter isLoggedIn={isLoggedIn}></AppRouter>
        </>
        :
        <div>
          Initializing...
        </div>
      }
    </>
  );
}

export default App;
