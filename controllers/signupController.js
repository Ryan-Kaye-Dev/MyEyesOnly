const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

//GET Sign Up form
exports.signup_get = function (req, res, next) {
  res.render("sign-up", { title: "Sign Up" });
};

//POST Sign Up page
exports.signup_post = [
  // Validate and sanitize fields.
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlpha()
    .withMessage("First name must be specified."),
  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified."),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username must be specified.")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric.")
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error("Username already in use");
      }
    }),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Password must be specified."),
  body("confirmPassword")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Confirm password must be specified.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from the request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("sign-up", {
        title: "Sign Up",
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: "",
        confirmPassword: "",
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid, create user.
      // bCrypt hash & Salt password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Create a user object with escaped and trimmed data.
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
      });

      // Save the new user.
      await user.save();

      // Redirect to home page.
      res.redirect("/");
    }
  }),
];
