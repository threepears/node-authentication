"use strict";

const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const RedisStore = require("connect-redis")(session);
const methodOverride = require("method-override");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes = require("./lib/user/routes");

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "supersecret";

app.set("view engine", "jade");

app.locals.title = '';

app.use(methodOverride("_method"));

app.use(session({
  secret: SESSION_SECRET,
  store: new RedisStore()
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());



app.use((req, res, next) => {
  // req.session.visits = req.session.visits || {};
  // req.session.visits[req.url] = req.session.visits[req.url] || 0;
  // req.session.visits[req.url]++;

  res.locals.user = req.user;

  //req.session.count = req.session.count || 0;
  //req.session.count++;
  console.log(req.user);
  console.log(res.locals);
  next();
});

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  console.log(res.locals);
  next();
});

app.use(userRoutes);

app.get("/", (req, res) => {
  // res.render("index", { user: req.session.user });
  res.render("index");
});

mongoose.connect('mongodb://localhost:27017/nodeauth', (err) => {
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});

