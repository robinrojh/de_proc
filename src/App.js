import AppRouter from './components/AppRouter'
import './App.css';
import { useEffect, useState } from "react";
import { authService } from "./functions/util/fbase";

const App = () => {
  // Provides a basic router for all the paths in the website.
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isLoggedIn])
  return (
    <>
      {init ?
        <AppRouter isLoggedIn={isLoggedIn}></AppRouter>
        :
        <div>
          Initializing...
        </div>
      }
    </>
  );
}

export default App;
