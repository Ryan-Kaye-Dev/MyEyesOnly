const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../models/user");

//GET Secret form
exports.secret_get = function (req, res, next) {
  res.render("secret", { title: "Secret" });
};

// POST Secret page
exports.secret_post = [
  body("secret").trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Handle validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.body.secret.includes("bisto")) {
      try {
        // Update the user's membership status
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.user._id }, // Assuming the user is already authenticated, and req.user contains the user document
          { $set: { membershipStatus: "Club" } },
          { new: true } // Return the modified document rather than the original
        );

        // NOTE: Do not need to do User.save() here because findOneAndUpdate() already saves the document.

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        res.redirect("/");
      } catch (err) {
        return next(err);
      }
    } else {
      res.redirect("/secret");
    }
  },
];
