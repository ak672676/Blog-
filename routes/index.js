var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res) {
  res.render("landing");
});

//AUTHENTICATION
//NEW USER
router.get("/register", function(req, res) {
  res.render("register");
});

//sign up logic
router.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to YelpCamp" + user.username);
      res.redirect("/posts");
    });
  });
});
//LOGIN Form
router.get("/login", function(req, res) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);
//logout
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "logged you out");
  res.redirect("/posts");
});

module.exports = router;
