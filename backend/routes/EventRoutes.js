const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/EventController");
const upload = require("../utils/multer");
const {
  isLoggedIn,
  isEventOrganizer,
  isAdmin,
} = require("../middleware/authMiddleware");

router.get("/my", isLoggedIn, isEventOrganizer, getMyEvents);

router.get(
  "/my-with-stats",
  isLoggedIn,
  isEventOrganizer,
  getMyEventsWithStats
);

router.get("/pending", isLoggedIn, isAdmin, getPendingEvents);

router.get("/rejected", isLoggedIn, isAdmin, getRejectedEvents);

router.get("/approved", isLoggedIn, isAdmin, getEvents);

router.post(
  "/",
  upload.single("image"),
  isLoggedIn,
  isEventOrganizer,
  addEvent
);

router.get("/", isLoggedIn, getEvents);

router.get("/:id", isLoggedIn, getEvent);

router.put(
  "/:id",
  upload.single("image"),
  isLoggedIn,
  isEventOrganizer,
  updateEvent
);

router.delete("/:id", isLoggedIn, isEventOrganizer, deleteEvent);

router.patch("/approve/:id", isLoggedIn, isAdmin, approveEvent);

router.patch("/reject/:id", isLoggedIn, isAdmin, rejectEvent);

module.exports = router;
