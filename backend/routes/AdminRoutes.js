const express = require("express");
const {
  getPendingOrganizers,
  approveOrganizer,
  rejectOrganizer,
  getApprovedOrganizers,
  getRejectedOrganizers,
  getAdminStats,
  getAllContactMessages,
  getContactMessage,
  replyContactMessage,
  getAllUsers,
  deleteUser,
} = require("../controllers/AdminController");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/stats", isLoggedIn, isAdmin, getAdminStats);

router.get("/users", isLoggedIn, isAdmin, getAllUsers);

router.get("/pending-organizers", isLoggedIn, isAdmin, getPendingOrganizers);

router.get("/approved-organizers", isLoggedIn, isAdmin, getApprovedOrganizers);

router.get("/rejected-organizers", isLoggedIn, isAdmin, getRejectedOrganizers);

router.put("/approve-organizer/:id", isLoggedIn, isAdmin, approveOrganizer);

router.put("/reject-organizer/:id", isLoggedIn, isAdmin, rejectOrganizer);

router.get("/contact-messages", isLoggedIn, isAdmin, getAllContactMessages);

router.get("/contact-message/:id", isLoggedIn, isAdmin, getContactMessage);

router.delete("/user/:id", isLoggedIn, isAdmin, deleteUser);

router.post(
  "/contact-message/reply/:id",
  isLoggedIn,
  isAdmin,
  replyContactMessage
);

module.exports = router;
