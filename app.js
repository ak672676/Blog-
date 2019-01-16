var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Post = require("./models/post");
var seedDB = require("./seeds");
var User = require("./models/user");
var Comment = require("./models/comment");

var commentRoutes = require("./routes/comments"),
  postRoutes = require("./routes/posts"),
  indexRoutes = require("./routes/index");

app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "My name is Amit",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Used for restriction on all the routes
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");

  next();
});

app.use("/posts/:id/comments", commentRoutes);
app.use("/posts", postRoutes);
app.use("/", indexRoutes);

app.listen(3000, "127.0.0.1", function() {
  console.log("Server has started");
});
