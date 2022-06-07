const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Ticket = require("../models/Ticket");

// @desc    Create new ticket page
// @route   GET /tickets/create
router.get("/create", ensureAuth, (req, res) => {
  res.render("tickets/create");
});

// @desc    Process create form
// @route   POST /tickets
router.post("/", ensureAuth, async (req, res) => {
  try {
    const newTicket = {
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      author: req.user.id,
    };
    await Ticket.create(newTicket);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// @desc    All tickets page
// @route   Get /tickets
router.get("/", ensureAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("author")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("tickets/index", {
      tickets,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// @desc    All tickets page
// @route   Get /tickets/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ _id: req.params.id }).lean();

    if (!ticket) {
      res.render("error/404");
    }

    if (ticket.author != req.user.id) {
      res.redirect("/tickets");
    } else {
      res.render("tickets/edit", {
        ticket,
      });
    }
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// @desc    Update ticket request
// @route   PUT /tickets/:id
router.put("/:id", ensureAuth, async (req, res) => {
  let ticket = await Ticket.findById(req.params.id).lean();

  if (!ticket) {
    return res.render("error/404");
  }

  if (ticket.author != req.user.id) {
    res.redirect("/tickets");
  } else {
    const updateTicket = {
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
    };
    ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id },
      updateTicket,
      { new: true, runValidators: true }
    );
  }

  res.redirect("/tickets");
});

// @desc    Delete ticket request
// @route   DELETE /tickets/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Ticket.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// @desc    Show ticket page
// @route   GET /tickets/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id).populate("author").lean();

    if (!ticket) {
      return res.render("error/404");
    }

    res.render("tickets/display", {
      ticket,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// @desc    Show user tickets
// @route   GET /tickets/author/:id
router.get("/author/:id", ensureAuth, async (req, res) => {
  try {
    let tickets = await Ticket.find({ author: req.params.id })
      .populate("author")
      .lean();

    res.render("tickets/index", {
      tickets,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

module.exports = router;
