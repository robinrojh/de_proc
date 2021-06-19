import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
    render = () => {
        return (
            <div>
                Home page!
                <button name="About" style={{ backgroundColor: "transparent", borderColor: "transparent" }}><Link to="/about">About</Link></button>
                <button name="SignIn" style={{ backgroundColor: "transparent", borderColor: "transparent" }}><Link to="/signin">Sign In</Link></button>
                <button name="SignUp" style={{ backgroundColor: "transparent", borderColor: "transparent" }}><Link to="/signup">Sign Up</Link></button>
            </div>
        )
    }
}

export default Home;