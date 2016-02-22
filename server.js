"use strict";

const express = require("express");
const app = express();
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "supersecret";

app.set("view engine", "jade");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: SESSION_SECRET,
  store: new RedisStore()
}));

app.use((req, res, next) => {
  req.session.visits = req.session.visits || {};
  req.session.visits[req.url] = req.session.visits[req.url] || 0;
  req.session.visits[req.url]++;

  //req.session.count = req.session.count || 0;
  //req.session.count++;
  console.log(req.session);
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  if (req.body.password === req.body.verify) {
    res.redirect("/login");
  } else {
    res.render("register", {
      message: "Passwords do not match",
      email: req.body.email
    });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
