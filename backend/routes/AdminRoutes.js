const express = require("express");
const {
  getPendingOrganizers,
  approveOrganizer,
  rejectOrganizer,
  getApprovedOrganizers,
  getRejectedOrganizers,
  getAdminStats,
} = require("../controllers/AdminController");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/stats", isLoggedIn, isAdmin, getAdminStats);

router.get("/pending-organizers", isLoggedIn, isAdmin, getPendingOrganizers);

router.get("/approved-organizers", isLoggedIn, isAdmin, getApprovedOrganizers);

router.get("/rejected-organizers", isLoggedIn, isAdmin, getRejectedOrganizers);

router.put("/approve-organizer/:id", isLoggedIn, isAdmin, approveOrganizer);

router.put("/reject-organizer/:id", isLoggedIn, isAdmin, rejectOrganizer);

module.exports = router;
