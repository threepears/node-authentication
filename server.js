"use strict";

const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const RedisStore = require("connect-redis")(session);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes = require("./lib/user/routes");

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "supersecret";

app.set("view engine", "jade");

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

app.use(userRoutes);

app.get("/", (req, res) => {
  res.render("index", { user: req.session.user });
});

mongoose.connect('mongodb://localhost:27017/nodeauth', (err) => {
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});

