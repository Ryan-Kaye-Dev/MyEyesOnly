var createError = require("http-errors");
var express = require("express");
var path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/user");

var indexRouter = require("./routes/index");

var app = express();

// Set up mongoose connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.DB_URL;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB, { useNewUrlParser: true });
  console.log("Connected to MongoDB");
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

// Check if User is authenticated
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

// Check if user is admin
app.use(function (req, res, next) {
  if (req.user) {
    if (req.user.membershipStatus === "Admin") {
      res.locals.isAdmin = true;
    } else {
      res.locals.isAdmin = false;
    }
  }
  next();
});

// Check if user is part of the club
app.use(function (req, res, next) {
  if (req.user) {
    if (req.user.membershipStatus === "Club") {
      res.locals.isInClub = true;
    } else {
      res.locals.isInClub = false;
    }
  }
  next();
});

app.use("/", indexRouter);

// Passport.js local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
