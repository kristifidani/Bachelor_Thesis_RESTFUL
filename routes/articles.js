const express = require("express");
const router = express.Router();

//Article Model
let Article = require("../models/article");
//User model
let User = require("../models/user");

//Get articles from db
router.get("/", ensureAuthenticated, (req, res) => {
  User.findById(req.user.id, function(err, user) {
    //console.log(user)
    Article.find({}, function(err, articles) {
      if (err) {
        console.log(err);
      } else {
        res.render("index", {
          title: "Articles",
          articles: articles
        });
      }
    });
  });
});
//author: user.username per te ber render vetem artikujt e userit te logged
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
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user.username;
    article.body = req.body.body;

    article.save(err => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success", "Article Added");
        res.redirect("/articles");
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

//Update submit post route
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
      res.redirect("/articles");
    }
  });
});

//Delete article
router.get("/delete/:id", ensureAuthenticated, function(req, res) {
  Article.findByIdAndRemove(req.params.id, function(err, article) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/articles");
    }
  });
});

//Get single article
router.get("/article/:id", ensureAuthenticated, function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    User.find({ name: article.author }, function(err, user) {
      //console.log(user)
      res.render("article", {
        article: article
      });
    });
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
