//environmental variables
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

//Article Model
let Article = require("../models/article");
//User model
let User = require("../models/user");

//Logged user profile
router.get("/profile/:id", ensureAuthenticated, function (req, res) {
  User.findById(req.user._id, function (err, user) {
    Article.find({ author: user.username }, (err, articles) => {
      if (err) {
        console.log(err);
      } else {
        res.render("user_profile", {
          user: user,
          articles: user.bookmarks,
          user_articles: articles,
        });
      }
    });
  });
});

//Author of book profile
router.get("/author_profile/:author", ensureAuthenticated, function (req, res) {
  User.findOne({ username: req.params.author }, function (err, user) {
    Article.find({ author: user.username }, (err, articles) => {
      if (err) {
        console.log(err);
      } else {
        res.render("user_profile", {
          user: user,
          articles: user.bookmarks,
          user_articles: articles,
        });
      }
    });
  });
});

//Register form
router.get("/register", function (req, res) {
  res.render("register");
});

//Register process
router.post("/register", function (req, res) {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("surname", "Surname is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Not valid email").isEmail();
  req.checkBody("username", "Username is required").notEmpty();
  //.matches("^[a-zA-Z][a-zA-Z0-9]{5,}$");
  req.checkBody("password", "Password is required").notEmpty();
  //.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$");
  req.checkBody("password2", "Confirm password is required").notEmpty();
  req
    .checkBody("password2", "Passwords do not match")
    .equals(req.body.password);

  const hashedPassword = bcrypt.hashSync(password, 8); //encrypt pass

  let errors = req.validationErrors();
  if (errors) {
    //req.flash("danger", "Fields requirements not fullfilled. Please check them again");
    //res.redirect("/users/register")
    res.render("register", {
      errors: errors,
    });
  } else {
    User.findOne({ username: req.body.username }, function (err, user) {
      //Check if email already exists in db
      if (err) {
        console.log(err);
      } else if (user) {
        req.flash("danger", "User exists !");
        res.redirect("/users/register");
      } else {
        User.create(
          {
            name,
            surname,
            email,
            username,
            password: hashedPassword,
          },
          function (err, user) {
            if (err)
              return res
                .status(500)
                .send("There was a problem registering the user.");

            // create a token with reference to the users id
            // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            //   expiresIn: "24h",
            // });

            //       const output = `<h2>Click on the link below to verify email </h2>
            // <a href="http://localhost:3000/users/afteremail/${token}" >${token}</a>
            // `;

            //       //Duhet te lejoj te opsionet e acc acces from less secure apps qe ta perdor gmail si host
            //       let transporter = nodemailer.createTransport({
            //         host: "smtp.gmail.com",
            //         port: 587,
            //         secure: false, // true for 465, false for other ports
            //         auth: {
            //           user: "kristifidani0@gmail.com",
            //           pass: "password",
            //         },
            //         tls: {
            //           rejectUnauthorized: false,
            //         },
            //       });

            //       // setup email data with unicode symbols
            //       let mailOptions = {
            //         from: '"Nodemail testing" <kristifidani0@gmail.com>',
            //         to: email,
            //         subject: "Email verification", // Subject line
            //         text: "Hello world?", // plain text body
            //         html: output, // html body
            //       };

            //       // send mail with defined transport object
            //       transporter.sendMail(mailOptions, (error, info) => {
            //         if (error) {
            //           return console.log(error);
            //         }
            //         console.log("Message sent: %s", info.messageId);
            //         console.log(
            //           "Preview URL: %s",
            //           nodemailer.getTestMessageUrl(info)
            //         );
            //       });
            req.flash("success", "Verify Email");
            res.redirect("/users/login");
            // res.send({ token: token });
          }
        );
      }
    });
  }
});

// //Confirm email
// router.get("/afteremail/:token", function (req, res) {
//   //const token = req.headers["x-access-token"];
//   const token = req.params.token;
//   //console.log(token);
//   if (!token) return res.send({ message: "No token provided." });

//   jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
//     if (err) return res.send({ message: "Failed to authenticate token." });

//     //res.send(decoded); gjen userin duke match id e tij me ate te tokenit qe esht te docode
//     User.findByIdAndUpdate(
//       { _id: decoded.id },
//       { active: true },
//       { password: 0 },
//       function (err, user) {
//         if (err) return res.send("There was a problem finding the user.");
//         if (!user) return res.send("No user found.");

//         res.send("User is now active");
//       }
//     );
//   });
// });

//Render login page
router.get("/login", function (req, res) {
  res.render("login");
});

//Login process
router.post("/login", function (req, res, next) {
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "Password is required").notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    res.render("login", {
      errors: errors,
    });
  } else {
    passport.authenticate("local", {
      failureRedirect: "/users/login",
      successRedirect: "/",
    })(req, res, next);
  }
});

//Logout
router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/");
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
