import { HashRouter as Router, Route } from 'react-router-dom';
import Home from '../routes/Home';
import About from '../routes/About';
import Lists from '../routes/List';
import SignIn from '../routes/SignIn';
import SignUp from '../routes/SignUp';

const AppRouter = () => {
    return (
        <Router>
            <Route path='/' exact> <Home /></Route>
            <Route path='/about' exact> <About /> </Route>
            <Route path='/lists' exact> <Lists /> </Route>
            <Route path='/signin' exact> <SignIn /> </Route>
            <Route path='/signup' exact> <SignUp /> </Route>
        </Router>
    )
}

export default AppRouter;