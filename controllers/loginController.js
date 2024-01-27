const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

//GET Login form
exports.login_get = function (req, res, next) {
  res.render("log-in", { title: "Log In" });
};

//POST Login page
exports.login_post = [
  passport.authenticate("local", {
    successRedirect: "/", // Redirect to the secret page if there is no error
    failureRedirect: "/log-in", // Redirect back to login page if there is an error
    failureFlash: false,
  }),
];
