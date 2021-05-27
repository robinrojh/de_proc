const functions = require("firebase-functions");
const { grabMyWork, addWork } = require("./handlers/work");
const { signup, login } = require("./handlers/users");
const FBAuth = require("./util/fbAuth");
var cors = require("cors");

const app = require("express")();
app.use(cors());

app.get("/work", FBAuth, grabMyWork);
app.post("/work", FBAuth, addWork);
app.post("/signup", signup);
app.post("/login", login);

exports.api = functions.region("asia-northeast3").https.onRequest(app);
