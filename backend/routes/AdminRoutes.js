const express = require("express");
const {
  getPendingOrganizers,
  approveOrganizer,
  rejectOrganizer,
} = require("../controllers/AdminController");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/pending-organizers", isLoggedIn, isAdmin, getPendingOrganizers);

router.put("/approve-organizer/:id", isLoggedIn, isAdmin, approveOrganizer);

router.put("/reject-organizer/:id", isLoggedIn, isAdmin, rejectOrganizer);

module.exports = router;
