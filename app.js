// Load environmental variables
require("dotenv").config();

// Import required packages
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const passport = require("passport");

// Import Article model
const Article = require("./models/article");

// Import articles and users routes
const articlesRoutes = require("./routes/articles");
const usersRoutes = require("./routes/users");

// Connect to the database
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Failed to connect"));
db.once("open", function () {
  console.log("DB connected");
});

// Initialize the express app
const app = express();

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Use bodyParser middleware for parsing requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Set up session middleware
app.use(
  session({
    secret: process.env.SECRET_2,
    resave: true,
    saveUninitialized: true,
  })
);

// Set up flash messages middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Set up express-validator middleware
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

// Configure and use passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Middleware to set user data for all routes
app.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Use articles and users routes
app.use("/articles", articlesRoutes);
app.use("/users", usersRoutes);

// Define home route
app.get("/", function (req, res) {
  Article.find({}, function (err, articles) {
    articles.sort(function (a, b) {
      const textA = a.title.toUpperCase();
      var textB = b.title.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Articles",
        articles: articles,
      });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});
