const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser =require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check connection
db.once('open', () =>{
    console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', (err) =>{
    console.log(err);
});

//Init app
const app = express();

//Bring in Models
let Article = require('./models/article');

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Home route
app.get('/', (req, res) => {
    Article.find({}, (err, articles)=>{
        if (err){
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
        });   
     }
 });
});

//Get single article
app.get('/article/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
       res.render('article', {
            article:article
        });
       });
});

//Add Route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: ' Add Articles'
    }); 
});

//Add submit post route
app.post('/articles/add', (req, res)=>{
 let article = new Article();
 article.title = req.body.title;   
 article.author = req.body.author;
 article.body = req.body.body;

 article.save((err)=>{
     if(err){
         console.log(err);
     } else{
         res.redirect('/');
     }
 });
});

//Load edit form
app.get('/article/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
       res.render('edit_article', {
            article:article,
            title: 'Edit Article'
        });
       });
});

//Update submit post route
app.post('/articles/edit/:id', (req, res)=>{
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
            res.redirect('/');
        }
    });
   });

//Delete article
   app.get('/article/delete/:id', function(req, res){
    Article.findByIdAndRemove(req.params.id, function(err, article){
        if(err){
      console.log(err);
        } else{
      res.redirect('/');
        }
    });
  });

   //Start Server
app.listen(3000, () => {
    console.log('You are at port 3000');
});