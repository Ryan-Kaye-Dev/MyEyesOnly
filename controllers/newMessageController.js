const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const Message = require("../models/message");

//GET New Message form
exports.new_message_get = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render("new-message", { title: "New Message" });
  } else {
    res.redirect("/log-in");
  }
};

// POST New Message form
exports.new_message_post = [
  // Validate and sanitize fields.
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title must be specified."),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Message must be specified."),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Handle validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a new message object with escaped and trimmed data.
    const newMessage = new Message({
      title: req.body.title,
      text: req.body.text,
      user: req.user._id,
      timestamp: Date.now(),
    });

    try {
      // Save the message to the database
      await newMessage.save();
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }),
];

exports.message_delete_get = async function (req, res, next) {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.render("delete-message", { title: "Delete Message", message: message });
  } catch (err) {
    return next(err);
  }
};

exports.message_delete_post = async function (req, res, next) {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    await Message.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
