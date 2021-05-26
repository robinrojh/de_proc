function Home(props) {
    return (
        <div>
            Home page!
            <button name="About" style={{ backgroundColor: "transparent", borderColor: "transparent" }}><link to="/about">About</link></button>
            <button name="SignIn" style={{ backgroundColor: "transparent", borderColor: "transparent" }}><link to="/signin">Sign In</link></button>
            <button name="SignUp" style={{ backgroundColor: "transparent", borderColor: "transparent" }}><link to="/signup">Sign Up</link></button>
            <button name="List" style={{ backgroundColor: "transparent", borderColor: "transparent" }}><link to="/lists">About</link></button>
        </div>
    )
}

export default Home;