var express = require("express");
var router = express.Router();
const signupController = require("../controllers/signupController");
const loginController = require("../controllers/loginController");
const secretController = require("../controllers/secretController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
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

module.exports = router;
