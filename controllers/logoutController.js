const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

//GET Logout form
exports.logout_get = function (req, res, next) {
  // Log the user out
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
