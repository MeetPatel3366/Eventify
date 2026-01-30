import express from "express";
import {
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
  getAllEventsWithStats,
  getBookingsByEvent,
} from "../controllers/AdminController.js";
import { isLoggedIn, isAdmin } from "../middleware/authMiddleware.js";
import { apiLimiter } from "../middleware/rateLimitMiddleware.js";
const router = express.Router();

router.use(apiLimiter)

router.get("/stats", isLoggedIn, isAdmin, getAdminStats);

router.get("/all-events-stats", isLoggedIn, isAdmin, getAllEventsWithStats);

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
  replyContactMessage,
);

router.get(
  "/events/:eventId/bookings",
  isLoggedIn,
  isAdmin,
  getBookingsByEvent,
);

export default router;
