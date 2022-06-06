const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Ticket = require("../models/Ticket");
const User = require("../models/User");

// @desc    Landing and Login page
// @route   GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("landing", {
    layout: "login",
  });
});

// @desc    Dashboard
// @route   GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ author: req.user.id }).lean();
    const user = await User.findById(req.user.id).lean();
    res.render("dashboard", {
      userName: user.firstName,
      tickets
    });
  } catch (error) {
    res.render("error/500");
  }
});

// @desc    test
// @route   GET /test
router.get("/test", (req, res) => {
  res.send("test");
})

module.exports = router;
