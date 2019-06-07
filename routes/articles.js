const express = require("express");
const router = express.Router();

//Article Model
let Article = require("../models/article");
//User model
let User = require("../models/user");
//Comment model
let Comment = require("../models/comment");

//Only user articles
router.get("/mine", ensureAuthenticated, function(req, res) {
  User.findById(req.user._id, (err, user) => {
    Article.find({ author: user.username }, function(err, articles) {
      if (err) {
        console.log(err);
      } else {
        res.render("index", {
          title: "Your Articles",
          articles: articles
        });
      }
    });
  });
});

//User bookmarks articles
router.get("/bookmarks", ensureAuthenticated, function(req, res) {
  User.findById(req.user._id, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Your Bookmarks",
        articles: articles.bookmarks
      });
    }
  });
});

//Add Route
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add_article", {
    title: " Add Articles"
  });
});

//Add article
router.post("/add", ensureAuthenticated, (req, res) => {
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("body", "Body is required").notEmpty();

  //Get errors
  let errors = req.validationErrors();
  if (errors) {
    res.render("add_article", {
      title: "Add Article",
      errors: errors
    });
  } else {
    Article.findOne({ title: req.body.title }, (err, article) => {
      if (err) {
        console.log(err);
      } else if (article) {
        req.flash("danger", "Title already in use");
        res.redirect("/articles/add");
      } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user.username;
        article.body = req.body.body;

        article.save(err => {
          if (err) {
            console.log(err);
          } else {
            req.flash("success", "Article Added");
            res.redirect("/");
          }
        });
      }
    });
  }
});

//Load edit form
router.get("/edit/:id", ensureAuthenticated, function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render("edit_article", {
      article: article,
      title: "Edit Article"
    });
  });
});

//Edit article
router.post("/edit/:id", ensureAuthenticated, (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.body = req.body.body;

  let query = { _id: req.params.id };

  Article.update(query, article, err => {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Article Updated");
      res.redirect("/articles/article/" + req.params.id);
    }
  });
});

//Delete article
router.get("/delete/:id", ensureAuthenticated, function(req, res) {
  Article.findByIdAndRemove(req.params.id, function(err, article) {
    Comment.remove({ articleID: article._id }, (err, comments) => {
      User.update(
        {},
        { $pull: { bookmarks: article } },
        { multi: true },
        (err, user) => {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash("success", "Article Deleted");
            res.redirect("/");
          }
        }
      );
    });
  });
});

//Get single article
router.get("/article/:id", ensureAuthenticated, function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    Comment.find({ articleID: req.params.id }, function(err, comments) {
      User.find({ name: article.author }, function(err, user) {
        res.render("article", {
          comments: comments,
          article: article
        });
      });
    });
  });
});

//Add comment
router.post("/article/:id", ensureAuthenticated, (req, res) => {
  let comment = new Comment();
  comment.user = req.user.username;
  comment.comment = req.body.comment;
  comment.articleID = req.params.id;

  comment.save(err => {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Article Updated");
      res.redirect("/articles/article/" + req.params.id);
    }
  });
});

//Delete Comment
router.get("/comment_del/:id", ensureAuthenticated, function(req, res) {
  Comment.findByIdAndRemove(req.params.id, function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/articles/article/" + comment.articleID);
    }
  });
});

//Bookmarks
router.post("/bookmarks/:id", ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    User.findById(req.user._id, (err, user) => {
      const kappa = user.bookmarks.find(element => {
        if (element.title === article.title) {
          return true;
        }
      });
      if (kappa) {
        req.flash("danger", "Article already bookmarked");
        res.redirect("/articles/article/" + req.params.id);
      } else {
        User.update(
          { username: req.user.username },
          { $push: { bookmarks: article } },
          err => {
            if (err) {
              console.log(err);
              return;
            } else {
              req.flash("success", "Article added to bookmarks");
              res.redirect("/articles/article/" + req.params.id);
              //res.redirect("/articles/bookmarks");
            }
          }
        );
      }
    });
  });
});

//Remove from bookmarks
router.post("/rm_bookmarks/:id", ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    User.findByIdAndUpdate(
      req.user._id,
      { $pull: { bookmarks: article } },
      (err, user) => {
        if (err) {
          console.log(err);
          return;
        } else {
          req.flash("success", "Removed from bookmarks");
          res.redirect("/articles/article/" + req.params.id);
        }
      }
    );
  });
});

//Access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    //res.redirect("/");
    res.render("login");
  }
}

module.exports = router;