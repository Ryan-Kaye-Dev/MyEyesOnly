var express = require("express");
var router = express.Router();
const signupController = require("../controllers/signupController");
const loginController = require("../controllers/loginController");
const secretController = require("../controllers/secretController");
const newMessageController = require("../controllers/newMessageController");
const logoutController = require("../controllers/logoutController");

const Message = require("../models/message");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const messages = await Message.find({})
    .sort({ timestamp: -1 }) // Sort messages from newest to oldest
    .limit(20) // Only return 20 messages
    .populate("user"); // Replace the user ID stored in the user field with a full user object

  res.render("index", { title: "Messages", messages: messages });
});

//GET Sign Up page
router.get("/sign-up", function (req, res, next) {
  res.render("sign-up", { title: "Sign Up" });
});

//POST Sign Up page
router.post("/sign-up", signupController.signup_post);

//GET Login page
router.get("/log-in", loginController.login_get);

//POST Login page
router.post("/log-in", loginController.login_post);

//GET Secret page
router.get("/secret", secretController.secret_get);

//POST Secret page
router.post("/secret", secretController.secret_post);

//GET New Message page
router.get("/new-message", newMessageController.new_message_get);

//POST New Message page
router.post("/new-message", newMessageController.new_message_post);

//GET Logout page
router.get("/log-out", logoutController.logout_get);

//GET Delete Message page
router.get("/message/:id/delete", newMessageController.message_delete_get);

//POST Delete Message page
router.post("/message/:id/delete", newMessageController.message_delete_post);

module.exports = router;
