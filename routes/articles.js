const express = require('express');
const router = express.Router();

//Bring in Article Model
let Article = require('../models/article');

//Add Route
router.get('/add', (req, res) => {
    res.render('add_article', {
        title: ' Add Articles'
    }); 
});

//Add submit post route
router.post('/add', (req, res)=>{
req.checkBody('title', 'Title is required').notEmpty();
req.checkBody('author', 'Author is required').notEmpty();
req.checkBody('body', 'Body is required').notEmpty();

//Get errors
let errors = req.validationErrors();
if(errors){
    res.render('add_article', {
        title: 'Add Article',
        errors:errors
    });
} else {
    let article = new Article();
    article.title = req.body.title;   
    article.author = req.body.author;
    article.body = req.body.body;
   
    article.save((err)=>{
        if(err){
            console.log(err);
        } else{
            req.flash('success', 'Article Added');
            res.redirect('/');
        }
    });
  }
});

//Load edit form
router.get('/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
       res.render('edit_article', {
            article:article,
            title: 'Edit Article'
        });
       });
});

//Update submit post route
router.post('/edit/:id', (req, res)=>{
    let article = {};
    article.title = req.body.title;   
    article.author = req.body.author;
    article.body = req.body.body;
   
let query = {_id:req.params.id}

    Article.update(query, article, (err)=>{
        if(err){
            console.log(err);
            return;
        } else{
            req.flash('success', 'Article Updated');
            res.redirect('/');
        }
    });
   });

//Delete article
router.get('/delete/:id', function(req, res){
    Article.findByIdAndRemove(req.params.id, function(err, article){
        if(err){
      console.log(err);
        } else{
      res.redirect('/');
        }
    });
  });

  //Get single article
router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
       res.render('article', {
            article:article
        });
       });
});

  module.exports = router;