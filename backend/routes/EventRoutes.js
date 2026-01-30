import express from "express";
const router = express.Router();
import {
  addEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
  getMyEvents,
  getPendingEvents,
  getRejectedEvents,
  getMyEventsWithStats,
  getEventProgress,
} from "../controllers/EventController.js";
import upload from "../utils/multer.js";
import {
  isLoggedIn,
  isEventOrganizer,
  isAdmin,
} from "../middleware/authMiddleware.js";
import { apiLimiter } from "../middleware/rateLimitMiddleware.js";

router.use(apiLimiter)

router.get("/my", isLoggedIn, isEventOrganizer, getMyEvents);

router.get(
  "/my-with-stats",
  isLoggedIn,
  isEventOrganizer,
  getMyEventsWithStats,
);

router.get("/pending", isLoggedIn, isAdmin, getPendingEvents);

router.get("/rejected", isLoggedIn, isAdmin, getRejectedEvents);

router.get("/approved", isLoggedIn, isAdmin, getEvents);

router.get("/progress", isLoggedIn, getEventProgress);

router.post(
  "/",
  upload.single("image"),
  isLoggedIn,
  isEventOrganizer,
  addEvent,
);

router.get("/", isLoggedIn, getEvents);

router.get("/:id", isLoggedIn, getEvent);

router.put(
  "/:id",
  upload.single("image"),
  isLoggedIn,
  isEventOrganizer,
  updateEvent,
);

router.delete("/:id", isLoggedIn, isEventOrganizer, deleteEvent);

router.patch("/approve/:id", isLoggedIn, isAdmin, approveEvent);

router.patch("/reject/:id", isLoggedIn, isAdmin, rejectEvent);

export default router;
