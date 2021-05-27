import { Link } from "react-router-dom";

function Home(props) {
    return (
        <div>
            Home page!
            <button name="About" style={{ backgroundColor: "transparent", borderColor: "transparent" }}><Link to="/about">About</Link></button>
            <button name="SignIn" style={{ backgroundColor: "transparent", borderColor: "transparent" }}><Link to="/signin">Sign In</Link></button>
            <button name="SignUp" style={{ backgroundColor: "transparent", borderColor: "transparent" }}><Link to="/signup">Sign Up</Link></button>
            <button name="List" style={{ backgroundColor: "transparent", borderColor: "transparent" }}><Link to="/lists">About</Link></button>
        </div>
    )
}

export default Home;