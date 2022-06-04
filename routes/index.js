const express = require("express");
const router = express.Router();

// @desc    Landing and Login page
// @route   GET /
router.get("/", (req, res) => {
    res.render('landing', {
        layout: 'login'
    })
});

// @desc    Dashboard
// @route   GET /dashboard
router.get("/dashboard", (req, res) => {
    res.render('dashboard')
});

// @desc    test
// @route   GET /test
router.get("/test", (req, res) => {
    res.send('test')
});

module.exports = router;
