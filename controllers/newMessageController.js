const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const message = require("../models/message");

//GET New Message form
exports.new_message_get = function (req, res, next) {
  res.render("new-message", { title: "New Message" });
};

// POST New Message form
exports.new_message_post = [];
