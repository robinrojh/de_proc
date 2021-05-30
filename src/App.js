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
      console.log(isLoggedIn)
      if (user) {
        setIsLoggedIn(true);
      }
      else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
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
