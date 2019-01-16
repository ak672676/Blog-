var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var middleware = require("../middleware");

router.get("/", function(req, res) {
  //  res.render("campgrounds", { campgrounds: campgrounds });
  Post.find({}, function(err, allPosts) {
    if (err) {
      console.log(err);
    } else {
      res.render("posts/index", {
        posts: allPosts
      });
    }
  });
});
//Create new post
router.post("/", middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var price = req.body.price;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newPost = {
    name: name,
    image: image,
    description: desc,
    price: price,
    author: author
  };

  Post.create(newPost, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      res.redirect("/posts");
    }
  });
});
//New Show Form
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("posts/new.ejs");
});
//show
router.get("/:id", function(req, res) {
  Post.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundPost) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundPost);
        res.render("posts/show", { post: foundPost });
      }
    });
});

//Edit
router.get("/:id/edit", middleware.checkPostOwnership, function(req, res) {
  Post.findById(req.params.id, function(err, foundPost) {
    res.render("posts/edit", { post: foundPost });
  });
});

//update

router.put("/:id", middleware.checkPostOwnership, function(req, res) {
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(
    err,
    updatedPost
  ) {
    if (err) {
      res.redirect("/posts");
    } else {
      res.redirect("/posts/" + req.params.id);
    }
  });
});

//DELETE POST
router.delete("/:id", middleware.checkPostOwnership, function(req, res) {
  Post.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/posts");
    } else {
      res.redirect("/posts");
    }
  });
});

module.exports = router;
