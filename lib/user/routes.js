"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("./model");

require('./local');

router.get("/login", (req, res) => {
  res.render("login");
});

router.post('/login',
  passport.authenticate('local',
    {
      successRedirect: '/',
      failureRedirect: '/login',
      successFlash: "Success!",
      failureFlash: "What the hell?"
    }
  )
);

  // User.findOne({ email: req.body.email}, (err, user) => {
  //   if (err) throw err;

  //   if (user) {
  //     user.authenticate(req.body.password, (err, valid) => {
  //       if (err) throw err;

  //       if (valid) {
  //         req.session.user = user;
  //         res.redirect("/");
  //       } else {
  //         res.redirect("/login");
  //       }
  //     })
  //   } else {
  //     res.redirect("/login");
  //   }
  // });

router.delete("/login", (req, res) => {
  req.session.regenerate(function(err) {
    if (err) throw err;

    res.redirect("/");
  });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  if (req.body.password === req.body.verify) {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) throw err;

      if (user) {
        res.redirect("/login");
      } else {
        User.create(req.body, (err) => {
          if (err) throw err;

          res.redirect("/login");
        });
      }
    });
  } else {
    res.render("register", {
      message: "Passwords do not match",
      email: req.body.email
    });
  }
});

module.exports = router;
