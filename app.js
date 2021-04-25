//environmental variables
require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const passport = require("passport");

//Bring in Models
let Article = require("./models/article");

//DB connect
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
//check if we have a successfull connections
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Failed to connect"));
db.once("open", function () {
  console.log("DB connected");
});

//Init app
const app = express();

//Load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, "public")));

//Express Session middleware
app.use(
  session({
    secret: process.env.SECRET_2,
    resave: true,
    saveUninitialized: true
  })
);

//Express Messages middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

//Express validator middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

//Passport config
require("./config/passport")(passport);
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//Route files
let articles = require("./routes/articles");
let users = require("./routes/users");
app.use("/articles", articles);
app.use("/users", users);

//Home route
app.get("/", function(req, res) {
  Article.find({}, function(err, articles) { 
    articles.sort(function(a, b) {
      const textA = a.title.toUpperCase();
      var textB = b.title.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Articles",
        articles: articles
      }); 
    }
  }); 
  //res.send('Hello World!')
});

//Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});