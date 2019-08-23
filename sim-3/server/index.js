require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");

const { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING } = process.env;

const ctrl = require("./controller");

const app = express();

massive(CONNECTION_STRING)
  .then(db => {
    app.set("db", db);
    console.log("Database connected");
  })
  .catch(err => console.log(err));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

app.use(express.json());

app.post("/auth/register", ctrl.register);
app.post("/auth/login", ctrl.login);
app.get("/auth/logout", ctrl.logout);

app.post("/post", ctrl.createPost);
app.get("/post", ctrl.getUserPosts);

app.listen(SERVER_PORT, () => {
  console.log("Listening on PORT " + SERVER_PORT);
});
