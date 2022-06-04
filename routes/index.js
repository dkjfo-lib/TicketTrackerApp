const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// @desc    Landing and Login page
// @route   GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("landing", {
    layout: "login",
  });
});

// @desc    Dashboard
// @route   GET /dashboard
router.get("/dashboard", ensureAuth, (req, res) => {
    console.log(req.user)
  res.render("dashboard", {
    userName: req.user.firstName,
  });
});

// @desc    test
// @route   GET /test
router.get("/test", (req, res) => {
  res.send("test");
});

module.exports = router;
