var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//GET Sign Up page
router.get("/sign-up", function (req, res, next) {
  res.render("sign-up", { title: "Sign Up" });
});

//POST Sign Up page
router.post("/sign-up", function (req, res, next) {
  res.redirect("/");
});

module.exports = router;
