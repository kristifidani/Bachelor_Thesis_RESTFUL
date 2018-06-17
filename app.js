const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const db = require("./config/database");
const passport = require("passport");

//DB connect
mongoose.connect(
  db.database,
  { useMongoClient: true }
);
mongoose.Promise = global.Promise;
//Check connection
let dbc = mongoose.connection;
dbc.once("open", () => {
  console.log("Connected to MongoDB");
});
//Check for DB errors
dbc.on("error", err => {
  console.log(err);
});

//Init app
const app = express();

//Bring in Models
let Article = require("./models/article");
let User = require("./models/user");

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
    secret: "keyboard cat",
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
  res.render("login");
});

//Start Server
app.listen(3000, () => {
  console.log("You are at port 3000");
});
