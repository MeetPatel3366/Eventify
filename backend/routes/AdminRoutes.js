const express = require("express");
const {
  getPendingOrganizers,
  approveOrganizer,
} = require("../controllers/AdminController");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/pending-organizers", isLoggedIn, isAdmin, getPendingOrganizers);

router.put("/approve-organizer", isLoggedIn, isAdmin, approveOrganizer);

module.exports = router;
